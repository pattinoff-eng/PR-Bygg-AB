
export enum WorkType {
  NORMAL = 'Normaltid',
  OVERTIME = 'Övertid',
  TRAVEL = 'Restid',
  ABSENCE = 'Frånvaro',
  ATA = 'ÄTA-arbete'
}

export interface Project {
  id: string;
  name: string;
  code: string;
  client: string;
  location: string;
}

export interface TimeEntry {
  id: string;
  date: string;
  projectId: string;
  hours: number;
  workType: WorkType;
  description: string;
  workerName: string;
}

export interface AIAnalysis {
  summary: string;
  efficiency: string;
  recommendations: string[];
}
