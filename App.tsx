import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom'; // Note: Using HashRouter for SPA logic as requested
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import MedicationList from './components/MedicationList';
import LifestyleTracker from './components/LifestyleTracker';
import AiAssistant from './components/AiAssistant';
import { Tab, DailyLog, DEFAULT_DAILY_LOG } from './types';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.DASHBOARD);
  const [dailyLog, setDailyLog] = useState<DailyLog>(DEFAULT_DAILY_LOG);

  // Load from localStorage on mount
  useEffect(() => {
    const savedLog = localStorage.getItem('heartguard_daily_log');
    const today = new Date().toISOString().split('T')[0];

    if (savedLog) {
      const parsed = JSON.parse(savedLog);
      // If stored log is from today, use it. Otherwise, reset to default with today's date.
      if (parsed.date === today) {
        setDailyLog(parsed);
      } else {
        setDailyLog({ ...DEFAULT_DAILY_LOG, date: today });
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('heartguard_daily_log', JSON.stringify(dailyLog));
  }, [dailyLog]);

  const handleUpdateLog = (updatedLog: DailyLog) => {
    setDailyLog(updatedLog);
  };

  const renderContent = () => {
    switch (currentTab) {
      case Tab.DASHBOARD:
        return <Dashboard log={dailyLog} onUpdate={handleUpdateLog} />;
      case Tab.MEDICATION:
        return <MedicationList log={dailyLog} onUpdate={handleUpdateLog} />;
      case Tab.LIFESTYLE:
        return <LifestyleTracker log={dailyLog} onUpdate={handleUpdateLog} />;
      case Tab.ASSISTANT:
        return <AiAssistant dailyLog={dailyLog} />;
      default:
        return <Dashboard log={dailyLog} onUpdate={handleUpdateLog} />;
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
        <main className="pb-20">
          {renderContent()}
        </main>
        <Navigation currentTab={currentTab} onTabChange={setCurrentTab} dailyLog={dailyLog} />
      </div>
    </HashRouter>
  );
};

export default App;