export type PathType = 'medie' | 'superiori';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  pathType: PathType | null;
  quizCompleted: boolean;
  bio?: string;
  classe?: string;
  scuolaCorrente?: string;
}

export interface UserValues {
  logica: number;
  creativita: number;
  socialita: number;
  praticita: number;
  umanistica: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  label: string;
  effects: Partial<UserValues>;
}

export interface QuizAnswer {
  questionId: string;
  optionId: string;
}

export interface QuizResult {
  values: UserValues;
  indirizzo: string;
  perche: string;
  materie: string[];
  traits: string[];
}

export interface Materia {
  nome: string;
  ore: number;
  descrizione?: string;
}

export interface OpenDay {
  id: string;
  date: string;
  ora: string;
  descrizione: string;
}

export interface SchoolStats {
  placement: number;
  students: number;
  studentRatio?: number;
}

export interface School {
  id: string;
  name: string;
  type: string;
  level: 'superiori' | 'universita';
  address: string;
  city: string;
  lat: number;
  lng: number;
  hero: { color1: string; color2: string };
  indirizzi: string[];
  recommendedIndirizzo?: string;
  materiePrincipali: string[];
  pianoStudi: { anno: number; materie: Materia[] }[];
  strutture: string[];
  opendays: OpenDay[];
  stats: SchoolStats;
  valuesProfile: UserValues;
  description: string;
}

export interface SavedSchool {
  schoolId: string;
  matchScore: number;
  savedAt: string;
}

export interface SavedOpenday {
  schoolId: string;
  opendayId: string;
  savedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}
