import { School, UserValues } from '@/types';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface ScoredSchool {
  school: School;
  matchScore: number;
  affinity: number;
  distanceScore: number;
  distanceKm: number | null;
}

const VALUE_KEYS: (keyof UserValues)[] = [
  'logica',
  'creativita',
  'socialita',
  'praticita',
  'umanistica',
];

export function clampValue(v: number): number {
  return Math.max(0, Math.min(100, v));
}

export function clampValues(values: UserValues): UserValues {
  return {
    logica: clampValue(values.logica),
    creativita: clampValue(values.creativita),
    socialita: clampValue(values.socialita),
    praticita: clampValue(values.praticita),
    umanistica: clampValue(values.umanistica),
  };
}

/**
 * Affinity 0-100 fra valori utente e profilo della scuola.
 * Calcolato come 1 - (distanza euclidea normalizzata sulle 5 dimensioni 0-100).
 */
export function computeAffinity(user: UserValues, school: UserValues): number {
  let sum = 0;
  for (const k of VALUE_KEYS) {
    const d = (user[k] - school[k]) / 100;
    sum += d * d;
  }
  const dist = Math.sqrt(sum / VALUE_KEYS.length);
  return Math.round((1 - dist) * 100);
}

/**
 * Punteggio distanza secondo le soglie del PDF.
 * <5km = 100, 5-10km = 70, 10-20km = 40, >20km = 10.
 * Se la posizione utente non è disponibile, restituisce 60 (neutro).
 */
export function computeDistanceScore(km: number | null): number {
  if (km == null) return 60;
  if (km < 5) return 100;
  if (km < 10) return 70;
  if (km < 20) return 40;
  return 10;
}

const EARTH_KM = 6371;

export function haversineKm(a: LatLng, b: LatLng): number {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.sqrt(h));
}

/**
 * Match Score = (affinità * 0.6) + (distanza_score * 0.4)  — formula del PDF.
 */
export function computeMatchScore(
  user: UserValues,
  school: School,
  userPos: LatLng | null
): ScoredSchool {
  const distanceKm = userPos
    ? haversineKm(userPos, { lat: school.lat, lng: school.lng })
    : null;
  const affinity = computeAffinity(user, school.valuesProfile);
  const distanceScore = computeDistanceScore(distanceKm);
  const matchScore = Math.round(affinity * 0.6 + distanceScore * 0.4);
  return { school, matchScore, affinity, distanceScore, distanceKm };
}

export function rankSchools(
  user: UserValues,
  schools: School[],
  userPos: LatLng | null,
  options?: { level?: 'superiori' | 'universita' }
): ScoredSchool[] {
  const filtered = options?.level
    ? schools.filter((s) => s.level === options.level)
    : schools;
  return filtered
    .map((s) => computeMatchScore(user, s, userPos))
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function suggestIndirizzo(
  user: UserValues,
  ranked: ScoredSchool[]
): { indirizzo: string; perche: string; materie: string[] } {
  const top = ranked[0];
  if (!top) {
    return {
      indirizzo: 'Liceo Scientifico',
      perche: 'Un percorso versatile da cui partire per molti ambiti.',
      materie: ['Matematica', 'Italiano', 'Inglese'],
    };
  }
  const indirizzo = top.school.recommendedIndirizzo ?? top.school.indirizzi[0] ?? top.school.name;
  const ranked5 = VALUE_KEYS
    .map((k) => ({ k, v: user[k] }))
    .sort((a, b) => b.v - a.v);
  const dominant = ranked5[0].k;
  const dominantLabel: Record<keyof UserValues, string> = {
    logica: 'pensiero logico',
    creativita: 'spinta creativa',
    socialita: 'attitudine relazionale',
    praticita: 'concretezza pratica',
    umanistica: 'sensibilità umanistica',
  };
  const perche = `Hai mostrato una forte ${dominantLabel[dominant]} e affinità ${top.affinity}% con il profilo ${top.school.name}.`;
  const materie = top.school.materiePrincipali.slice(0, 6);
  return { indirizzo, perche, materie };
}
