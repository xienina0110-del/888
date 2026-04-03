import React from 'react';
import { Pill, CheckCircle2, Circle, Sun, Moon, Sunrise } from 'lucide-react';
import { DailyLog } from '../types';

interface Props {
  log: DailyLog;
  onUpdate: (updatedLog: DailyLog) => void;
}

const MedicationList: React.FC<Props> = ({ log, onUpdate }) => {
  
  const toggleMedication = (time: 'morning' | 'noon' | 'evening') => {
    onUpdate({
      ...log,
      medication: {
        ...log.medication,
        [time]: !log.medication[time]
      }
    });
  };

  const renderCard = (
    time: 'morning' | 'noon' | 'evening',
    title: string,
    icon: React.ReactNode,
    colorClass: string,
    pills: string[],
    borderColor: string,
    shadowColor: string
  ) => {
    const isTaken = log.medication[time];

    return (
      <div 
        onClick={() => toggleMedication(time)}
        className={`relative overflow-hidden rounded-[2rem] p-7 mb-6 cursor-pointer transition-all duration-500 border
        ${isTaken 
          ? 'bg-white border-emerald-200 shadow-lg shadow-emerald-100/50' 
          : `bg-white ${borderColor} ${shadowColor} shadow-sm hover:shadow-md hover:-translate-y-1`}`}
      >
        {/* Progress Bar Background for visual feedback when taken */}
        <div className={`absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-emerald-100/30 transition-transform duration-700 origin-left ${isTaken ? 'scale-x-100' : 'scale-x-0'}`}></div>

        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center space-x-5">
            <div className={`p-4 rounded-2xl shadow-md ${colorClass} text-white ring-4 ring-white`}>
              {icon}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${isTaken ? 'text-emerald-900' : 'text-stone-800'}`}>{title}</h3>
              <p className={`text-sm mt-1 font-medium ${isTaken ? 'text-emerald-600' : 'text-stone-500'}`}>建议餐后服用</p>
            </div>
          </div>
          <div className="transition-transform duration-300 hover:scale-110">
            {isTaken ? (
                <CheckCircle2 size={40} className="text-emerald-500 drop-shadow-sm" fill="#ecfdf5" />
            ) : (
                <Circle size={40} className="text-stone-200 hover:text-stone-300 transition-colors" strokeWidth={1.5} />
            )}
          </div>
        </div>

        <div className="mt-6 pl-[84px] relative z-10">
          <div className="flex flex-wrap gap-2.5">
            {pills.map((pill, idx) => (
              <span key={idx} className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors
                ${isTaken 
                    ? 'bg-emerald-100/80 text-emerald-700 border border-emerald-200' 
                    : 'bg-stone-100 text-stone-600 border border-stone-200'}`}>
                <Pill size={14} className="mr-1.5 opacity-70" />
                {pill}
              </span>
            ))}
          </div>
        </div>
        
        {/* Background Decoration */}
        {isTaken && (
          <div className="absolute -bottom-6 -right-6 text-emerald-500 opacity-10 rotate-12">
             <Pill size={140} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 pb-28">
      <div className="mb-8 pt-4 px-2">
        <h2 className="text-2xl font-extrabold text-stone-800">今日服药打卡</h2>
        <p className="text-stone-500 mt-1.5 font-medium">按时吃药是预防血管再次堵塞的关键</p>
      </div>

      {renderCard(
        'morning', 
        '早安服药', 
        <Sunrise size={28} strokeWidth={2} />, 
        'bg-gradient-to-br from-orange-400 to-rose-400', 
        ['抗血小板药', '降脂药'],
        'border-orange-100',
        'hover:shadow-orange-100'
      )}
      
      {renderCard(
        'noon', 
        '午间服药', 
        <Sun size={28} strokeWidth={2} />, 
        'bg-gradient-to-br from-amber-400 to-orange-400', 
        ['降压药', '护胃药'],
        'border-amber-100',
        'hover:shadow-amber-100'
      )}
      
      {renderCard(
        'evening', 
        '晚安服药', 
        <Moon size={28} strokeWidth={2} />, 
        'bg-gradient-to-br from-indigo-400 to-violet-500', 
        ['辅助药物A', '辅助药物B'],
        'border-indigo-100',
        'hover:shadow-indigo-100'
      )}
      
      <div className="mt-10 bg-blue-50 p-6 rounded-3xl border border-blue-100">
        <div className="flex gap-3">
            <span className="text-xl">💡</span>
            <p className="text-blue-800 text-sm font-medium leading-relaxed">
            提示：如果忘记服药，请立即咨询医生，不要擅自补服双倍剂量。保持规律的血药浓度对支架维护非常重要。
            </p>
        </div>
      </div>
    </div>
  );
};

export default MedicationList;