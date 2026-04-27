// Stub di default usato da TypeScript per la risoluzione dei tipi.
// A runtime Metro usa MapView.native.tsx (mobile) o MapView.web.tsx (web).
import type { LatLng } from '@/lib/matching';
import type { School } from '@/types';

export interface MapViewImplProps {
  pos: LatLng | null;
  schools: School[];
  onSelect: (s: School) => void;
}

declare const MapViewImpl: (props: MapViewImplProps) => JSX.Element;
export default MapViewImpl;
