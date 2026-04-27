import * as Location from 'expo-location';
import { LatLng } from '@/lib/matching';

const DEFAULT_FALLBACK: LatLng = { lat: 41.9028, lng: 12.4964 }; // Roma

export async function getUserLocation(): Promise<LatLng | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch {
    return null;
  }
}

export function getFallbackLocation(): LatLng {
  return DEFAULT_FALLBACK;
}
