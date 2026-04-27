import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedOpenday, SavedSchool } from '@/types';

const STORAGE_KEY = 'next-step.schools';

interface SchoolsState {
  savedSchools: SavedSchool[];
  savedOpendays: SavedOpenday[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  toggleSchool: (schoolId: string, matchScore: number) => void;
  toggleOpenday: (schoolId: string, opendayId: string) => void;
  isSaved: (schoolId: string) => boolean;
  isOpendaySaved: (schoolId: string, opendayId: string) => boolean;
}

const persist = async (state: { savedSchools: SavedSchool[]; savedOpendays: SavedOpenday[] }) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
};

export const useSchoolsStore = create<SchoolsState>((set, get) => ({
  savedSchools: [],
  savedOpendays: [],
  hydrated: false,
  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { savedSchools: SavedSchool[]; savedOpendays: SavedOpenday[] };
        set({
          savedSchools: data.savedSchools ?? [],
          savedOpendays: data.savedOpendays ?? [],
          hydrated: true,
        });
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true });
    }
  },
  toggleSchool: (schoolId, matchScore) => {
    const exists = get().savedSchools.find((s) => s.schoolId === schoolId);
    const next = exists
      ? get().savedSchools.filter((s) => s.schoolId !== schoolId)
      : [...get().savedSchools, { schoolId, matchScore, savedAt: new Date().toISOString() }];
    set({ savedSchools: next });
    void persist({ savedSchools: next, savedOpendays: get().savedOpendays });
  },
  toggleOpenday: (schoolId, opendayId) => {
    const exists = get().savedOpendays.find(
      (o) => o.schoolId === schoolId && o.opendayId === opendayId
    );
    const next = exists
      ? get().savedOpendays.filter(
          (o) => !(o.schoolId === schoolId && o.opendayId === opendayId)
        )
      : [
          ...get().savedOpendays,
          { schoolId, opendayId, savedAt: new Date().toISOString() },
        ];
    set({ savedOpendays: next });
    void persist({ savedSchools: get().savedSchools, savedOpendays: next });
  },
  isSaved: (schoolId) => !!get().savedSchools.find((s) => s.schoolId === schoolId),
  isOpendaySaved: (schoolId, opendayId) =>
    !!get().savedOpendays.find(
      (o) => o.schoolId === schoolId && o.opendayId === opendayId
    ),
}));
