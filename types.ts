export enum Tab {
  DASHBOARD = 'DASHBOARD',
  MEDICATION = 'MEDICATION',
  LIFESTYLE = 'LIFESTYLE',
  ASSISTANT = 'ASSISTANT',
}

export interface MedicationStatus {
  morning: boolean;
  noon: boolean;
  evening: boolean;
}

// Specific medication details (2 types per session as requested)
export interface MedicationDetails {
  id: string;
  name: string;
  description?: string;
}

export interface DailyLog {
  date: string; // ISO Date string YYYY-MM-DD
  medication: MedicationStatus;
  diet: {
    lowSaltOil: boolean;
    fruitsVeggies: boolean;
    waterIntake: number; // cups
  };
  exercise: {
    durationMinutes: number; // target 20
    type: string;
    completed: boolean;
  };
  sleep: {
    bedTime: string; // e.g., "22:00"
    wakeTime: string; // e.g., "07:00"
    restful: boolean;
  };
  healthMetrics: {
    steps: number;
    heartRate: number; // avg bpm
    lastSynced: string | null;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export const DEFAULT_DAILY_LOG: DailyLog = {
  date: new Date().toISOString().split('T')[0],
  medication: { morning: false, noon: false, evening: false },
  diet: { lowSaltOil: false, fruitsVeggies: false, waterIntake: 0 },
  exercise: { durationMinutes: 0, type: '散步', completed: false },
  sleep: { bedTime: '', wakeTime: '', restful: true },
  healthMetrics: { steps: 0, heartRate: 0, lastSynced: null },
};