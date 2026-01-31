
import { Project, WorkType } from './types';

export const PROJECTS: Project[] = [
  { id: '1', name: 'Brf Ekbacken', code: 'P2023-01', client: 'Skanska', location: 'Solna' },
  { id: '2', name: 'Villa Granhult', code: 'V2023-44', client: 'Andersson Privat', location: 'Täby' },
  { id: '3', name: 'Stadshuset Renovering', code: 'R2024-05', client: 'Stockholms Stad', location: 'Centrum' },
  { id: '4', name: 'Gärdets Skola - Etapp 2', code: 'S2023-12', client: 'SISAB', location: 'Gärdet' },
];

export const WORK_TYPES = Object.values(WorkType);
