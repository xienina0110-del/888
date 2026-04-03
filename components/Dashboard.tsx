import React, { useState } from 'react';
import { DailyLog } from '../types';
import { HeartPulse, Trophy, CalendarDays, Activity, Watch, Footprints, RefreshCw, ChevronRight, AlertTriangle, BellRing, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface Props {
  log: DailyLog;
  onUpdate: (updatedLog: DailyLog) => void;
}

const Dashboard: React.FC<Props> = ({ log, onUpdate }) => {
  const [isSyncing, setIsSyncing] = useState(false);

  // Calculate daily progress percentage
  const calculateScore = () => {
    let score = 0;
    let total = 0;
    
    // Meds (3 points)
    if (log.medication.morning) score++;
    if (log.medication.noon) score++;
    if (log.medication.evening) score++;
    total += 3;

    // Diet (2 points)
    if (log.diet.lowSaltOil) score++;
    if (log.diet.fruitsVeggies) score++;
    total += 2;

    // Exercise (1 point)
    if (log.exercise.completed) score++;
    total += 1;

    return Math.round((score / total) * 100);
  };

  const handleSyncDevice = () => {
    setIsSyncing(true);
    // Simulate API delay
    setTimeout(() => {
        const newSteps = Math.floor(Math.random() * (8000 - 2000) + 2000); // Random steps between 2000-8000
        const newHR = Math.floor(Math.random() * (85 - 60) + 60); // Random HR between 60-85
        
        onUpdate({
            ...log,
            healthMetrics: {
                steps: newSteps,
                heartRate: newHR,
                lastSynced: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
            }
        });
        setIsSyncing(false);
    }, 1500);
  };

  const score = calculateScore();

  const gaugeData = [
    { name: 'Completed', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  // Mock data for weekly adherence (In a real app, this comes from history)
  const weeklyData = [
    { name: '周一', score: 85 },
    { name: '周二', score: 90 },
    { name: '周三', score: 100 },
    { name: '周四', score: 60 },
    { name: '周五', score: score }, // Today
    { name: '周六', score: 0 },
    { name: '周日', score: 0 },
  ];

  // Warmer palette for charts
  const COLORS = ['#ffffff', 'rgba(255,255,255,0.3)'];

  // Check for pending tasks for the Alarm System
  const getPendingAlerts = () => {
      const meds = [];
      if (!log.medication.morning) meds.push('早安服药');
      if (!log.medication.noon) meds.push('午间服药');
      if (!log.medication.evening) meds.push('晚安服药');

      const lifestyle = [];
      if (!log.exercise.completed) lifestyle.push('今日运动');
      if (!log.diet.lowSaltOil) lifestyle.push('少油少盐');
      if (!log.diet.fruitsVeggies) lifestyle.push('水果粗粮');

      return { meds, lifestyle };
  };

  const alerts = getPendingAlerts();
  const hasCriticalAlert = alerts.meds.length > 0;
  const hasLifestyleAlert = alerts.lifestyle.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 pb-28 space-y-6">
      {/* Header Area */}
      <div className="flex items-center justify-between pt-2 px-2">
         <div>
            <h1 className="text-2xl font-extrabold text-stone-800 tracking-tight">爸爸，早上好 🌞</h1>
            <p className="text-stone-500 text-sm mt-1 font-medium">{new Date().toLocaleDateString('zh-CN', {month: 'long', day: 'numeric', weekday: 'long'})}</p>
         </div>
         <div className="bg-white p-3 rounded-2xl shadow-sm border border-stone-100">
            <HeartPulse size={28} className="text-rose-500" fill="#f43f5e" fillOpacity={0.1} />
         </div>
      </div>

      {/* 🔴 ALARM / ALERT SECTION */}
      {(hasCriticalAlert || hasLifestyleAlert) && (
        <div className={`relative overflow-hidden rounded-[2rem] p-5 shadow-lg animate-in fade-in zoom-in duration-300 border-2
            ${hasCriticalAlert 
                ? 'bg-red-50 border-red-200 shadow-red-100' 
                : 'bg-orange-50 border-orange-200 shadow-orange-100'}`}>
            
            {/* Pulsing Background for Critical Alerts */}
            {hasCriticalAlert && (
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-400 rounded-full opacity-10 animate-ping"></div>
            )}

            <div className="flex items-start gap-4 relative z-10">
                <div className={`p-3 rounded-full flex-shrink-0 animate-bounce-slow
                    ${hasCriticalAlert ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                    {hasCriticalAlert ? <BellRing size={24} fill="currentColor" /> : <AlertTriangle size={24} />}
                </div>
                <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-1 ${hasCriticalAlert ? 'text-red-700' : 'text-orange-700'}`}>
                        {hasCriticalAlert ? '⚠️ 服药提醒' : '💡 待办提醒'}
                    </h3>
                    <div className="space-y-1">
                        {hasCriticalAlert && (
                            <p className="text-red-600 text-sm font-medium">
                                您还有 <span className="font-bold underline">{alerts.meds.join('、')}</span> 未服用，请按时吃药保护心脏！
                            </p>
                        )}
                        {!hasCriticalAlert && hasLifestyleAlert && (
                             <p className="text-orange-600 text-sm font-medium">
                                别忘了完成：{alerts.lifestyle.join('、')}。
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Main Score Card - Warm Sunrise Gradient */}
      <div className="bg-gradient-to-br from-rose-400 via-orange-400 to-amber-400 rounded-[2.5rem] p-6 shadow-xl shadow-rose-200/80 text-white relative overflow-hidden">
        {/* Decorative Warm Glows */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-yellow-300 opacity-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 rounded-full bg-rose-600 opacity-10 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-rose-50 font-bold text-sm tracking-widest uppercase mb-1 opacity-90">今日健康指数</h2>
            
            <div className="h-40 w-full relative my-2">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="50%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={65}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                >
                    {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-2">
                <span className="text-5xl font-bold leading-none drop-shadow-sm">{score}</span>
                <span className="text-sm text-rose-100 block mt-1 font-medium">分</span>
            </div>
            </div>
            
            <div className="text-center mt-[-30px]">
            {score === 100 ? (
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/25 backdrop-blur-md border border-white/40 text-white text-sm font-bold shadow-sm">
                <Trophy size={16} className="mr-2 text-yellow-200 fill-yellow-200"/> 非常完美！
                </div>
            ) : (
                <p className="text-white/90 text-sm font-medium bg-black/5 px-4 py-1.5 rounded-full backdrop-blur-sm">
                    加油，还有任务未完成！
                </p>
            )}
            </div>
        </div>
      </div>

      {/* Quick Status Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Medication Status - Warm/Comfortable */}
        <div className={`p-5 rounded-3xl border shadow-sm bg-white transition-all group
            ${log.medication.morning && log.medication.noon && log.medication.evening 
                ? 'border-emerald-200 shadow-emerald-100/60' 
                : 'border-stone-100 hover:border-orange-200'}`}>
           <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-stone-700">服药进度</span>
              <div className={`p-2 rounded-full transition-colors ${log.medication.morning && log.medication.noon && log.medication.evening ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 text-stone-400'}`}>
                  <Activity size={18} />
              </div>
           </div>
           <div className="flex space-x-2 mb-2">
              <div className={`h-3 w-full rounded-full transition-colors duration-500 ${log.medication.morning ? 'bg-emerald-400' : 'bg-stone-100'}`}></div>
              <div className={`h-3 w-full rounded-full transition-colors duration-500 ${log.medication.noon ? 'bg-emerald-400' : 'bg-stone-100'}`}></div>
              <div className={`h-3 w-full rounded-full transition-colors duration-500 ${log.medication.evening ? 'bg-emerald-400' : 'bg-stone-100'}`}></div>
           </div>
           <p className="text-xs text-stone-400 mt-3 text-right font-medium">
             {log.medication.morning && log.medication.noon && log.medication.evening ? '全部完成' : '进行中...'}
           </p>
        </div>

        {/* Exercise Status - Energetic Orange */}
        <div className={`p-5 rounded-3xl border shadow-sm bg-white transition-all
            ${log.exercise.completed 
                ? 'border-orange-200 shadow-orange-100/60' 
                : 'border-stone-100'}`}>
           <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-stone-700">运动打卡</span>
               <div className={`p-2 rounded-full ${log.exercise.completed ? 'bg-orange-100 text-orange-600' : 'bg-stone-100 text-stone-400'}`}>
                  <Activity size={18} />
              </div>
           </div>
           <div>
               <p className={`text-lg font-extrabold ${log.exercise.completed ? 'text-orange-500' : 'text-stone-300'}`}>
                {log.exercise.completed ? '已达标 🎉' : '未达标'}
                </p>
                <p className="text-xs text-stone-400 mt-1 font-medium">
                    {log.exercise.completed ? `${log.exercise.type} ${log.exercise.durationMinutes}分钟` : '目标: 20分钟'}
                </p>
           </div>
        </div>
      </div>

      {/* Wearable Data Card - Clean & Modern */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
                <div className="bg-rose-50 p-2.5 rounded-2xl text-rose-500">
                    <Watch size={20} />
                </div>
                <h3 className="font-bold text-stone-800">智能设备</h3>
            </div>
            <button 
                onClick={handleSyncDevice}
                disabled={isSyncing}
                className="flex items-center space-x-1.5 text-xs bg-stone-50 text-stone-600 px-3 py-1.5 rounded-full border border-stone-200 hover:bg-white hover:border-rose-200 hover:text-rose-500 hover:shadow-sm transition-all active:scale-95 font-medium"
            >
                <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
                <span>{isSyncing ? '同步中...' : '同步数据'}</span>
            </button>
         </div>

         <div className="grid grid-cols-2 gap-4">
            {/* Steps - Fresh Blue/Green */}
            <div className="bg-[#f0f9ff] p-5 rounded-[1.2rem] border border-sky-100 flex flex-col items-center justify-center group hover:border-sky-200 transition-all">
                <div className="flex items-center space-x-1.5 text-sky-400 mb-2 group-hover:text-sky-500">
                    <Footprints size={18} />
                    <span className="text-xs font-bold">今日步数</span>
                </div>
                <span className="text-3xl font-extrabold text-stone-800 tracking-tight">
                    {log.healthMetrics.steps > 0 ? log.healthMetrics.steps.toLocaleString() : '--'}
                </span>
                <span className="text-[10px] text-sky-300 uppercase tracking-wider mt-1 font-bold">Steps</span>
            </div>
            
            {/* Heart Rate - Warm Rose */}
            <div className="bg-[#fff1f2] p-5 rounded-[1.2rem] border border-rose-100 flex flex-col items-center justify-center group hover:border-rose-200 transition-all">
                <div className="flex items-center space-x-1.5 text-rose-400 mb-2 group-hover:text-rose-500">
                    <HeartPulse size={18} />
                    <span className="text-xs font-bold">平均心率</span>
                </div>
                <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-extrabold text-stone-800 tracking-tight">
                        {log.healthMetrics.heartRate > 0 ? log.healthMetrics.heartRate : '--'}
                    </span>
                    <span className="text-sm text-rose-500 animate-pulse font-bold">bpm</span>
                </div>
                 <span className="text-[10px] text-rose-300 uppercase tracking-wider mt-1 font-bold">Heart Rate</span>
            </div>
         </div>
         <div className="flex justify-end items-center mt-4 space-x-1.5">
             <div className={`w-2 h-2 rounded-full ${log.healthMetrics.lastSynced ? 'bg-emerald-400' : 'bg-stone-300'}`}></div>
             <p className="text-[11px] text-stone-400 font-medium">
                {log.healthMetrics.lastSynced ? `更新于 ${log.healthMetrics.lastSynced}` : '点击右上角同步'}
            </p>
         </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
         <div className="flex items-center justify-between mb-6">
             <div className="flex items-center space-x-2.5 text-stone-800">
                <div className="p-2 bg-orange-50 rounded-xl text-orange-500">
                    <CalendarDays size={20} />
                </div>
                <h3 className="font-bold">本周趋势</h3>
             </div>
             <ChevronRight size={16} className="text-stone-300" />
         </div>
         <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barGap={8}>
                <XAxis 
                    dataKey="name" 
                    tick={{fontSize: 12, fill: '#a8a29e', fontWeight: 500}} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={10} 
                />
                <YAxis hide />
                <Tooltip 
                    cursor={{fill: '#fafaf9', radius: 8}} 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff', color: '#57534e'}} 
                />
                <Bar 
                    dataKey="score" 
                    fill="#fb7185" // Rose-400
                    radius={[8, 8, 8, 8]} 
                    barSize={14} 
                    background={{ fill: '#f5f5f4', radius: 8 }}
                />
              </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="text-center text-xs text-stone-400 pt-4 pb-8 font-medium">
        免责声明：本应用仅供健康管理参考，身体不适请立即就医。
      </div>
    </div>
  );
};

export default Dashboard;