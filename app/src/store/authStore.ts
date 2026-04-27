import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PathType, User } from '@/types';

const STORAGE_KEY = 'next-step.auth';

interface AuthState {
  user: User | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  setPath: (pathType: PathType) => void;
  setQuizCompleted: (done: boolean) => void;
  updateProfile: (patch: Partial<User>) => void;
  logout: () => Promise<void>;
}

const defaultUser = (overrides: Partial<User>): User => ({
  id: `u_${Date.now()}`,
  email: 'studente@nextstep.it',
  name: 'Studente',
  avatarUrl: undefined,
  pathType: null,
  quizCompleted: false,
  bio: '',
  classe: '',
  scuolaCorrente: '',
  ...overrides,
});

const persist = async (user: User | null) => {
  try {
    if (user) await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  hydrated: false,
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const user = raw ? (JSON.parse(raw) as User) : null;
      set({ user, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },
  loginWithGoogle: async () => {
    const u = defaultUser({ name: 'Sara R.', email: 'sara@gmail.com' });
    set({ user: u });
    await persist(u);
  },
  loginWithEmail: async (email) => {
    const u = defaultUser({ email, name: email.split('@')[0] || 'Studente' });
    set({ user: u });
    await persist(u);
  },
  setPath: (pathType) => {
    const cur = get().user;
    if (!cur) return;
    const u = { ...cur, pathType };
    set({ user: u });
    void persist(u);
  },
  setQuizCompleted: (done) => {
    const cur = get().user;
    if (!cur) return;
    const u = { ...cur, quizCompleted: done };
    set({ user: u });
    void persist(u);
  },
  updateProfile: (patch) => {
    const cur = get().user;
    if (!cur) return;
    const u = { ...cur, ...patch };
    set({ user: u });
    void persist(u);
  },
  logout: async () => {
    set({ user: null });
    await persist(null);
  },
}));
