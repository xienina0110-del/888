import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Mic, Volume2, MicOff, MoreHorizontal } from 'lucide-react';
import { generateHealthAdvice, playTextAsSpeech } from '../services/geminiService';
import { DailyLog, ChatMessage } from '../types';

interface Props {
  dailyLog: DailyLog;
}

const AiAssistant: React.FC<Props> = ({ dailyLog }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '您好！我是您的专属心脏康复助手。\n\n关于术后饮食、运动注意事项或药物相关的小知识，您都可以问我。您可以直接说话，或输入文字。',
      timestamp: Date.now()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const context = `
    用户今日记录:
    药物: 早${dailyLog.medication.morning ? '已服' : '未服'}, 午${dailyLog.medication.noon ? '已服' : '未服'}, 晚${dailyLog.medication.evening ? '已服' : '未服'}
    饮食: 少油盐 ${dailyLog.diet.lowSaltOil ? '是' : '否'}, 水果谷物 ${dailyLog.diet.fruitsVeggies ? '是' : '否'}
    运动: ${dailyLog.exercise.completed ? `已完成${dailyLog.exercise.type} ${dailyLog.exercise.durationMinutes}分钟` : `未达标 (当前${dailyLog.exercise.durationMinutes}分钟)`}
    
    【智能设备健康监测数据】:
    - 今日步数: ${dailyLog.healthMetrics.steps > 0 ? dailyLog.healthMetrics.steps + '步' : '暂无数据'}
    - 平均心率: ${dailyLog.healthMetrics.heartRate > 0 ? dailyLog.healthMetrics.heartRate + ' bpm' : '暂无数据'}
    - 同步时间: ${dailyLog.healthMetrics.lastSynced || '未同步'}
    `;

    try {
      const responseText = await generateHealthAdvice(userMsg.text, context);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("抱歉，您的浏览器不支持语音输入功能。请尝试使用Chrome浏览器。");
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev ? prev + ' ' + transcript : transcript);
    };

    recognition.onerror = (event: any) => {
        console.error("Speech error", event);
        setIsListening(false);
    };

    try {
        recognition.start();
    } catch (e) {
        console.error(e);
    }
  };

  const handlePlayAudio = async (msgId: string, text: string) => {
    if (playingMsgId) return; 
    setPlayingMsgId(msgId);
    try {
        await playTextAsSpeech(text);
    } catch (e) {
        alert("语音播放失败，请稍后再试。");
    } finally {
        setPlayingMsgId(null);
    }
  };

  const suggestions = [
    "我的心率正常吗？",
    "今天步数够了吗？",
    "支架术后能吃鸡蛋吗？",
    "我今天感觉稍微有点累"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#fcfbf9]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 shadow-sm z-10 border-b border-stone-200 flex items-center justify-between sticky top-0">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-rose-400 to-orange-400 p-2.5 rounded-xl text-white shadow-md shadow-rose-100">
            <Sparkles size={20} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-stone-800">智能康复助手</h2>
            <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-stone-500 font-medium">在线</span>
            </div>
          </div>
        </div>
        <button className="text-stone-400 hover:text-stone-600">
            <MoreHorizontal size={24} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth pb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border-2 border-white
                ${msg.role === 'user' ? 'bg-stone-200 text-stone-600' : 'bg-gradient-to-tr from-emerald-400 to-teal-500 text-white'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              
              <div className="flex flex-col gap-1.5">
                <div className={`px-5 py-3.5 rounded-[1.5rem] text-[15px] leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                    ? 'bg-rose-500 text-white rounded-tr-none shadow-rose-200' 
                    : 'bg-white text-stone-700 border border-stone-100 rounded-tl-none'}`}>
                    {msg.text}
                </div>
                
                {/* TTS Button for Model Messages */}
                {msg.role === 'model' && (
                    <button 
                        onClick={() => handlePlayAudio(msg.id, msg.text)}
                        disabled={playingMsgId !== null}
                        className={`self-start flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all duration-200 border
                        ${playingMsgId === msg.id 
                            ? 'text-emerald-600 bg-emerald-50 border-emerald-100' 
                            : 'text-stone-400 bg-white/50 border-stone-200 hover:bg-white hover:border-stone-300 hover:text-stone-600'}`}
                    >
                        {playingMsgId === msg.id ? <Loader2 size={12} className="animate-spin" /> : <Volume2 size={12} />}
                        <span>{playingMsgId === msg.id ? '播放中...' : '朗读回答'}</span>
                    </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start w-full pl-14 animate-pulse">
             <div className="flex items-center gap-2 bg-white/60 border border-stone-100 px-4 py-3 rounded-2xl rounded-tl-none">
                <Loader2 size={16} className="animate-spin text-rose-500" />
                <span className="text-stone-400 text-sm font-medium">正在思考...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-stone-200 p-4 pb-safe">
        {messages.length < 3 && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-1 scrollbar-hide">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="whitespace-nowrap px-4 py-2 bg-stone-50 text-stone-600 rounded-xl text-sm border border-stone-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm font-medium"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-end gap-2 bg-stone-100 p-1.5 rounded-[28px] border border-transparent focus-within:border-rose-200 focus-within:ring-4 focus-within:ring-rose-50 transition-all">
            {/* Voice Input Button */}
            <button
                onClick={startListening}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-sm flex-shrink-0
                ${isListening 
                    ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200' 
                    : 'bg-white text-stone-400 hover:text-stone-600 hover:bg-stone-50'}`}
            >
                {isListening ? <MicOff size={20} /> : <Mic size={22} />}
            </button>

            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                placeholder={isListening ? "正在聆听..." : "输入您的问题..."}
                rows={1}
                className="flex-1 bg-transparent border-0 py-3 px-2 focus:ring-0 text-stone-800 placeholder:text-stone-400 resize-none max-h-24 leading-normal font-medium"
                style={{minHeight: '44px'}}
            />
          
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md
              ${isLoading || !input.trim() 
                ? 'bg-stone-200 text-stone-400' 
                : 'bg-rose-500 text-white hover:bg-rose-600 hover:scale-105 active:scale-95 shadow-rose-200'}`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;