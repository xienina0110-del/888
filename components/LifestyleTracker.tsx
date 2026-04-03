import React from 'react';
import { Utensils, Footprints, Moon, HeartPulse, Droplets, Check, Minus, Plus, ChevronDown } from 'lucide-react';
import { DailyLog } from '../types';

interface Props {
  log: DailyLog;
  onUpdate: (updatedLog: DailyLog) => void;
}

const LifestyleTracker: React.FC<Props> = ({ log, onUpdate }) => {

  const toggleDiet = (field: keyof typeof log.diet) => {
    if (typeof log.diet[field] === 'boolean') {
       onUpdate({
        ...log,
        diet: { ...log.diet, [field]: !log.diet[field] }
      });
    }
  };

  const adjustWater = (delta: number) => {
    const newVal = Math.max(0, log.diet.waterIntake + delta);
    onUpdate({
      ...log,
      diet: { ...log.diet, waterIntake: newVal }
    });
  };

  const calculateSleepInfo = () => {
    const { bedTime, wakeTime } = log.sleep;
    if (!bedTime || !wakeTime) return null;

    const [bedH, bedM] = bedTime.split(':').map(Number);
    const [wakeH, wakeM] = wakeTime.split(':').map(Number);

    let duration = 0;
    const bedMins = bedH * 60 + bedM;
    const wakeMins = wakeH * 60 + wakeM;

    if (wakeMins < bedMins) {
        duration = (1440 - bedMins + wakeMins) / 60;
    } else {
        duration = (wakeMins - bedMins) / 60;
    }
    
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    
    let qualityText = "时长适宜";
    let qualityColor = "text-emerald-600 bg-emerald-100";
    let bgColor = "bg-emerald-50";
    let borderColor = "border-emerald-200";
    let tip = "作息规律有助于心脏康复。";

    if (duration < 6) {
        qualityText = "睡眠不足";
        qualityColor = "text-orange-600 bg-orange-100";
        bgColor = "bg-orange-50";
        borderColor = "border-orange-200";
        tip = "建议增加休息时间，保证精力充沛。";
    } else if (duration > 10) {
         qualityText = "睡眠过长";
         qualityColor = "text-blue-600 bg-blue-100";
         bgColor = "bg-blue-50";
         borderColor = "border-blue-200";
         tip = "适当活动更有益于身体恢复。";
    }

    const isLate = bedH >= 23 || (bedH >= 0 && bedH < 5);
    
    if (isLate) {
        tip = "建议早睡（23点前），更有利于血管修复。";
        if (duration < 6) {
            tip = "睡得太晚且时长不足，请务必调整作息。";
        }
        
        if (qualityText === "时长适宜") {
            qualityText = "睡得太晚";
            qualityColor = "text-orange-600 bg-orange-100";
            bgColor = "bg-orange-50";
            borderColor = "border-orange-200";
        }
    }

    return {
        durationText: `${hours}小时${minutes > 0 ? ` ${minutes}分` : ''}`,
        qualityText,
        qualityColor,
        bgColor,
        borderColor,
        tip
    };
  };

  const sleepInfo = calculateSleepInfo();

  return (
    <div className="w-full max-w-2xl mx-auto p-4 pb-28 space-y-6">
      
      {/* Header */}
      <div className="px-2 pt-2">
        <h2 className="text-2xl font-extrabold text-stone-800">健康生活习惯</h2>
        <p className="text-stone-500 mt-1 font-medium">坚持少油少盐，适度运动，规律作息</p>
      </div>

      {/* Diet Section - Fresh & Tasty Colors */}
      <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-stone-100">
        <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 bg-lime-100 rounded-xl text-lime-700">
                <Utensils size={22} />
            </div>
            <h3 className="text-lg font-bold text-stone-800">饮食管理</h3>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => toggleDiet('lowSaltOil')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 group
            ${log.diet.lowSaltOil 
                ? 'border-lime-400 bg-lime-50' 
                : 'border-stone-100 hover:border-lime-200 bg-stone-50/50'}`}
          >
            <span className={`font-bold text-base transition-colors ${log.diet.lowSaltOil ? 'text-lime-800' : 'text-stone-600'}`}>
                🥗 今日坚持少油少盐
            </span>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors
                ${log.diet.lowSaltOil ? 'bg-lime-500 border-lime-500' : 'border-stone-300 bg-white'}`}>
                {log.diet.lowSaltOil && <Check size={16} className="text-white" strokeWidth={3} />}
            </div>
          </button>

          <button 
            onClick={() => toggleDiet('fruitsVeggies')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 group
            ${log.diet.fruitsVeggies 
                ? 'border-lime-400 bg-lime-50' 
                : 'border-stone-100 hover:border-lime-200 bg-stone-50/50'}`}
          >
            <span className={`font-bold text-base transition-colors ${log.diet.fruitsVeggies ? 'text-lime-800' : 'text-stone-600'}`}>
                🍎 吃了水果或粗粮
            </span>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors
                ${log.diet.fruitsVeggies ? 'bg-lime-500 border-lime-500' : 'border-stone-300 bg-white'}`}>
                {log.diet.fruitsVeggies && <Check size={16} className="text-white" strokeWidth={3} />}
            </div>
          </button>

          <div className="p-5 rounded-2xl bg-[#f0f9ff] border border-sky-100 flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3 text-sky-800">
              <div className="p-1.5 bg-white rounded-lg shadow-sm text-sky-500">
                <Droplets size={18} fill="currentColor" />
              </div>
              <span className="font-bold">饮水记录 (杯)</span>
            </div>
            <div className="flex items-center space-x-4 bg-white rounded-xl p-1.5 shadow-sm border border-sky-100">
              <button onClick={() => adjustWater(-1)} className="w-9 h-9 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors">
                <Minus size={18} />
              </button>
              <span className="text-xl font-extrabold text-sky-600 w-8 text-center">{log.diet.waterIntake}</span>
              <button onClick={() => adjustWater(1)} className="w-9 h-9 flex items-center justify-center rounded-lg bg-sky-400 text-white shadow-md shadow-sky-200 hover:bg-sky-500 transition-colors">
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Exercise Section - Warm Energy */}
      <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-stone-100">
        <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 bg-orange-100 rounded-xl text-orange-600">
                 <Footprints size={22} />
            </div>
            <h3 className="text-lg font-bold text-stone-800">运动康复</h3>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 mb-6 flex items-start gap-3">
          <span className="text-xl">🎯</span>
          <div>
            <p className="text-orange-900 font-bold text-sm mb-0.5">目标：每天运动 20 分钟</p>
            <p className="text-xs text-orange-800/70 font-medium">⚠️ 注意：若感到胸闷或极度疲劳，请立即停止。</p>
          </div>
        </div>

        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">运动类型</label>
                    <div className="relative">
                        <select
                            value={log.exercise.type}
                            onChange={(e) => {
                                onUpdate({
                                    ...log,
                                    exercise: { ...log.exercise, type: e.target.value }
                                });
                            }}
                            className="w-full p-3.5 pr-8 rounded-2xl border border-stone-200 bg-stone-50 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 appearance-none transition-all"
                        >
                            <option value="散步">🚶 散步</option>
                            <option value="慢跑">🏃 慢跑</option>
                            <option value="太极">🧘 太极</option>
                            <option value="瑜伽">🤸 瑜伽</option>
                            <option value="骑行">🚴 骑行</option>
                            <option value="其他">🏅 其他</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider pl-1">时长</label>
                    <div className="relative">
                        <input
                            type="number"
                            min="0"
                            value={log.exercise.durationMinutes === 0 ? '' : log.exercise.durationMinutes}
                            onChange={(e) => {
                                const minutes = parseInt(e.target.value) || 0;
                                onUpdate({
                                    ...log,
                                    exercise: { 
                                        ...log.exercise, 
                                        durationMinutes: minutes,
                                        completed: minutes >= 20 
                                    }
                                });
                            }}
                            placeholder="0"
                            className="w-full p-3.5 rounded-2xl border border-stone-200 bg-stone-50 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-bold">分钟</span>
                    </div>
                </div>
            </div>

            <div 
                className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300
                ${log.exercise.completed 
                    ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-white shadow-sm' 
                    : 'border-stone-200 bg-stone-50/50 border-dashed'}`}
            >
                <div className="text-left">
                    <span className={`font-extrabold text-lg block mb-0.5 ${log.exercise.completed ? 'text-orange-600' : 'text-stone-400'}`}>
                        {log.exercise.completed ? '今日运动已达标' : '尚未达标'}
                    </span>
                    <span className="text-stone-500 text-sm font-medium">
                        {log.exercise.completed ? `太棒了！已完成 ${log.exercise.durationMinutes} 分钟` : '继续加油，还差一点点'}
                    </span>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                ${log.exercise.completed 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 scale-110' 
                    : 'bg-stone-200 text-stone-400'}`}>
                    {log.exercise.completed ? <Check size={24} strokeWidth={3} /> : <Footprints size={20} />}
                </div>
            </div>
        </div>
      </section>

       {/* Sleep Section - Calming Violet */}
       <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-stone-100">
        <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 bg-violet-100 rounded-xl text-violet-600">
                <Moon size={22} />
            </div>
            <h3 className="text-lg font-bold text-stone-800">规律作息</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
           <div className="p-4 bg-violet-50/50 rounded-2xl border border-violet-100 hover:border-violet-300 transition-colors cursor-pointer group">
              <label className="block text-xs font-bold text-violet-400 mb-1.5 uppercase">睡觉时间</label>
              <input 
                type="time" 
                value={log.sleep.bedTime}
                onChange={(e) => onUpdate({...log, sleep: {...log.sleep, bedTime: e.target.value}})}
                className="bg-transparent text-xl font-bold text-violet-900 focus:outline-none w-full cursor-pointer font-mono" 
              />
           </div>
           <div className="p-4 bg-violet-50/50 rounded-2xl border border-violet-100 hover:border-violet-300 transition-colors cursor-pointer group">
              <label className="block text-xs font-bold text-violet-400 mb-1.5 uppercase">起床时间</label>
              <input 
                type="time" 
                value={log.sleep.wakeTime}
                onChange={(e) => onUpdate({...log, sleep: {...log.sleep, wakeTime: e.target.value}})}
                className="bg-transparent text-xl font-bold text-violet-900 focus:outline-none w-full cursor-pointer font-mono" 
              />
           </div>
        </div>

        {sleepInfo && (
            <div className={`p-5 rounded-2xl border ${sleepInfo.borderColor} ${sleepInfo.bgColor} transition-all`}>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-stone-700 font-bold flex items-center gap-2">
                        <span>😴 睡眠时长:</span>
                        <span className="text-lg font-extrabold">{sleepInfo.durationText}</span>
                    </span>
                    <span className={`font-bold px-3 py-1 rounded-lg text-xs ${sleepInfo.qualityColor}`}>
                        {sleepInfo.qualityText}
                    </span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed opacity-90 font-medium">{sleepInfo.tip}</p>
            </div>
        )}
      </section>
      
    </div>
  );
};

export default LifestyleTracker;