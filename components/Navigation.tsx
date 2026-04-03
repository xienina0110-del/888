import React from 'react';
import { LayoutDashboard, Pill, Activity, MessageCircleHeart } from 'lucide-react';
import { Tab, DailyLog } from '../types';

interface Props {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  dailyLog: DailyLog;
}

const Navigation: React.FC<Props> = ({ currentTab, onTabChange, dailyLog }) => {
  
  // Calculate badges
  const hasPendingMeds = !dailyLog.medication.morning || !dailyLog.medication.noon || !dailyLog.medication.evening;
  const hasPendingLifestyle = !dailyLog.exercise.completed || !dailyLog.diet.lowSaltOil || !dailyLog.diet.fruitsVeggies;

  const navItems = [
    { id: Tab.DASHBOARD, icon: LayoutDashboard, label: '首页', hasBadge: false },
    { id: Tab.MEDICATION, icon: Pill, label: '服药', hasBadge: hasPendingMeds },
    { id: Tab.LIFESTYLE, icon: Activity, label: '生活', hasBadge: hasPendingLifestyle },
    { id: Tab.ASSISTANT, icon: MessageCircleHeart, label: '助手', hasBadge: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-stone-200 pb-safe pt-2 px-6 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-50">
      <div className="flex justify-between items-end max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="group flex flex-col items-center p-2 relative"
            >
              {/* Active Indicator */}
              <div className={`absolute -top-2 w-8 h-1 bg-rose-500 rounded-b-full transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
              
              {/* Notification Badge */}
              {item.hasBadge && (
                <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white z-10 animate-pulse"></span>
              )}

              <div className={`p-1.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-rose-50 text-rose-500 -translate-y-1' : 'text-stone-400 group-hover:text-stone-600'}`}>
                 <Icon size={isActive ? 24 : 24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <span className={`text-[10px] mt-1 font-bold transition-all duration-300 ${isActive ? 'text-rose-500 opacity-100' : 'text-stone-400 opacity-80'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;