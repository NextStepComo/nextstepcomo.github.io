import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizAnswer, QuizResult, UserValues } from '@/types';
import { quizQuestions } from '@/data/quizQuestions';
import { clampValues } from '@/lib/matching';

const STORAGE_KEY = 'next-step.quiz';

const NEUTRAL: UserValues = {
  logica: 50,
  creativita: 50,
  socialita: 50,
  praticita: 50,
  umanistica: 50,
};

interface QuizState {
  step: number;
  answers: QuizAnswer[];
  result: QuizResult | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  reset: () => void;
  answer: (questionId: string, optionId: string) => void;
  goBack: () => void;
  computeValues: () => UserValues;
  setResult: (r: QuizResult) => void;
  overrideValues: (v: UserValues) => void;
}

const persist = async (state: { answers: QuizAnswer[]; result: QuizResult | null }) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
};

export const useQuizStore = create<QuizState>((set, get) => ({
  step: 0,
  answers: [],
  result: null,
  hydrated: false,
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { answers: QuizAnswer[]; result: QuizResult | null };
        set({ answers: data.answers ?? [], result: data.result ?? null, hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true });
    }
  },
  reset: () => {
    set({ step: 0, answers: [], result: null });
    void persist({ answers: [], result: null });
  },
  answer: (questionId, optionId) => {
    const filtered = get().answers.filter((a) => a.questionId !== questionId);
    const next = [...filtered, { questionId, optionId }];
    set({ answers: next, step: get().step + 1 });
    void persist({ answers: next, result: get().result });
  },
  goBack: () => set({ step: Math.max(0, get().step - 1) }),
  computeValues: () => {
    const values = { ...NEUTRAL };
    for (const a of get().answers) {
      const q = quizQuestions.find((qq) => qq.id === a.questionId);
      const opt = q?.options.find((o) => o.id === a.optionId);
      if (!opt) continue;
      for (const k of Object.keys(opt.effects) as (keyof UserValues)[]) {
        values[k] = (values[k] ?? 0) + (opt.effects[k] ?? 0);
      }
    }
    return clampValues(values);
  },
  setResult: (r) => {
    set({ result: r });
    void persist({ answers: get().answers, result: r });
  },
  overrideValues: (v) => {
    const cur = get().result;
    const next: QuizResult = cur
      ? { ...cur, values: clampValues(v) }
      : { values: clampValues(v), indirizzo: '—', perche: '', materie: [], traits: [] };
    set({ result: next });
    void persist({ answers: get().answers, result: next });
  },
}));
