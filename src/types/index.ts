export interface BPHistoryEntry {
  date: string;
  systolic: number;
  diastolic: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'L' | 'P';
  phone: string;
  email: string;
  address: string;
  status: 'Normal' | 'Pra Hipertensi' | 'Tingkat 1' | 'Tingkat 2';
  lastChecked: string;
  bpHistory: BPHistoryEntry[];
}

export interface PredictionRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  modelUsed: string;
  confidenceScore: number;
  accuracyDT?: number;
  accuracyRF?: number;
  systolic: number;
  diastolic: number;
  age: number;
  gender: 'L' | 'P';
  weight: number;
  height: number;
  bmi: number;
  result: 'Normal' | 'Pra Hipertensi' | 'Tingkat 1' | 'Tingkat 2';
}

export type ActiveTab = 'dashboard' | 'history' | 'patients' | 'settings';

export interface DoctorProfile {
  name: string;
  specialty: string;
  hospital: string;
  avatarUrl: string;
}

export interface AIModelConfig {
  activeModel: 'Random Forest' | 'Decision Tree' | 'Decision Tree & Random Forest';
  rfTrees: number;
  rfMaxDepth: number;
  dtMinSamples: number;
  lrIterations: number;
  confidenceFactor: number; // multiplier for realism tweaking
}

export interface ActivityNotification {
  id: number;
  title: string;
  desc: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  isRead: boolean;
  createdAt: string;
}

