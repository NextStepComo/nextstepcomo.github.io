import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import { LatLng } from '@/lib/matching';
import { School } from '@/types';
import { getFallbackLocation } from '@/services/location';
import { colors } from '@/theme';

interface Props {
  pos: LatLng | null;
  schools: School[];
  onSelect: (s: School) => void;
}

export default function MapViewImpl({ pos, schools, onSelect }: Props) {
  const initial = pos ?? getFallbackLocation();
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={StyleSheet.absoluteFillObject}
      initialRegion={{
        latitude: initial.lat,
        longitude: initial.lng,
        latitudeDelta: 1.6,
        longitudeDelta: 1.6,
      }}
      showsUserLocation
      showsMyLocationButton={false}
    >
      <UrlTile
        urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maximumZ={19}
        flipY={false}
      />
      {schools.map((s) => (
        <Marker
          key={s.id}
          coordinate={{ latitude: s.lat, longitude: s.lng }}
          onPress={() => onSelect(s)}
          pinColor={colors.primary}
          title={s.name}
          description={`${s.city} · ${s.type}`}
        />
      ))}
    </MapView>
  );
}
