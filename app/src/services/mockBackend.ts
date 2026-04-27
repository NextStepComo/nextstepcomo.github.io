import schools from '@/data/schools.json';
import { School } from '@/types';

const allSchools = schools as School[];

/**
 * Mock data layer. Pronto a essere sostituito con Supabase:
 * - getSchools() → supabase.from('schools').select()
 * - getSchoolById(id) → supabase.from('schools').select().eq('id', id).single()
 */
export async function getSchools(): Promise<School[]> {
  return allSchools;
}

export async function getSchoolById(id: string): Promise<School | null> {
  return allSchools.find((s) => s.id === id) ?? null;
}

export function getSchoolByIdSync(id: string): School | null {
  return allSchools.find((s) => s.id === id) ?? null;
}
