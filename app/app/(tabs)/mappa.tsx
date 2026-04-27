import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import MapViewImpl from '@/components/MapView';
import { LatLng, haversineKm, rankSchools } from '@/lib/matching';
import schools from '@/data/schools.json';
import { School } from '@/types';
import { useQuizStore } from '@/store/quizStore';
import { useAuthStore } from '@/store/authStore';
import { getFallbackLocation, getUserLocation } from '@/services/location';
import { colors, fontFamily, radius, shadow, spacing } from '@/theme';

const allSchools = schools as School[];

const FILTERS = ['Tutte', 'ITI', 'Liceo', 'Università', 'Alberghiero'] as const;

export default function MapScreen() {
  const result = useQuizStore((s) => s.result);
  const user = useAuthStore((s) => s.user);
  const [pos, setPos] = useState<LatLng | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<typeof FILTERS[number]>('Tutte');
  const [selected, setSelected] = useState<School | null>(null);

  useEffect(() => {
    let alive = true;
    getUserLocation().then((p) => alive && setPos(p ?? getFallbackLocation()));
    return () => {
      alive = false;
    };
  }, []);

  const visible = useMemo(() => {
    let list = allSchools;
    if (query.trim().length) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.indirizzi.some((i) => i.toLowerCase().includes(q))
      );
    }
    if (filter !== 'Tutte') {
      list = list.filter((s) => {
        if (filter === 'ITI') return s.type.toLowerCase().includes('iti');
        if (filter === 'Liceo') return s.type.toLowerCase().includes('liceo');
        if (filter === 'Università') return s.level === 'universita';
        if (filter === 'Alberghiero') return s.type.toLowerCase().includes('alber');
        return true;
      });
    }
    if (result) {
      const ranked = rankSchools(result.values, list, pos);
      return ranked;
    }
    return list.map((s) => ({
      school: s,
      matchScore: 0,
      affinity: 0,
      distanceScore: 0,
      distanceKm: pos ? haversineKm(pos, { lat: s.lat, lng: s.lng }) : null,
    }));
  }, [query, filter, result, pos]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Scuole vicine</Text>
        <Text style={styles.sub}>{visible.length} risultati</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <MaterialIcons name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Cerca per nome, città o indirizzo"
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {FILTERS.map((f) => (
          <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} size="sm" />
        ))}
      </ScrollView>

      <View style={styles.mapWrap}>
        <MapViewImpl pos={pos} schools={visible.map((v) => v.school)} onSelect={setSelected} />
        {!!pos && (
          <Pressable
            onPress={() => getUserLocation().then((p) => p && setPos(p))}
            style={styles.fab}
          >
            <MaterialIcons name="my-location" size={20} color="#fff" />
          </Pressable>
        )}
      </View>

      <BottomSheet
        school={selected}
        distanceKm={
          selected && pos
            ? haversineKm(pos, { lat: selected.lat, lng: selected.lng })
            : null
        }
        onClose={() => setSelected(null)}
        onOpen={() => {
          if (selected) {
            const id = selected.id;
            setSelected(null);
            router.push(`/school/${id}`);
          }
        }}
      />
    </SafeAreaView>
  );
}

interface BottomSheetProps {
  school: School | null;
  distanceKm: number | null;
  onClose: () => void;
  onOpen: () => void;
}

function BottomSheet({ school, distanceKm, onClose, onOpen }: BottomSheetProps) {
  if (!school) return null;
  return (
    <View style={styles.sheetOverlay}>
      <Card style={styles.sheetCard}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHead}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sheetType}>{school.type.toUpperCase()}</Text>
            <Text style={styles.sheetName}>{school.name}</Text>
            <Text style={styles.sheetCity}>
              {school.city} · {school.address}
            </Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <MaterialIcons name="close" size={18} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.sheetMeta}>
          {distanceKm != null && (
            <View style={styles.metaItem}>
              <MaterialIcons name="straighten" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{distanceKm.toFixed(1)} km</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <MaterialIcons name="directions-bus" size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>BUS · TRAM</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="schedule" size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>~{Math.round((distanceKm ?? 5) * 3)} min</Text>
          </View>
        </View>
        <Pressable onPress={onOpen} style={({ pressed }) => [styles.sheetCta, pressed && { opacity: 0.92 }]}>
          <Text style={styles.sheetCtaText}>Vedi dettagli</Text>
          <MaterialIcons name="arrow-forward" size={18} color="#fff" />
        </Pressable>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgSoft },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  title: { fontFamily: fontFamily.display, fontSize: 24, color: colors.text },
  sub: { fontFamily: fontFamily.body, fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  searchRow: { paddingHorizontal: spacing.xl, marginTop: spacing.md },
  searchBox: {
    height: 46,
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontFamily: fontFamily.bodyMedium,
    color: colors.text,
    fontSize: 14,
  },
  filters: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.sm },
  mapWrap: { flex: 1, marginTop: spacing.sm, position: 'relative' },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.fab,
  },
  sheetOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
  },
  sheetCard: { padding: spacing.lg, ...shadow.cardLarge },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  sheetHead: { flexDirection: 'row', alignItems: 'flex-start' },
  sheetType: { fontFamily: fontFamily.bodyBold, fontSize: 11, color: colors.primary, letterSpacing: 0.6 },
  sheetName: { fontFamily: fontFamily.display, fontSize: 18, color: colors.text, marginTop: 4 },
  sheetCity: { fontFamily: fontFamily.body, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetMeta: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: spacing.lg, marginBottom: 6 },
  metaText: {
    marginLeft: 4,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  sheetCta: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCtaText: {
    fontFamily: fontFamily.bodyBold,
    color: '#fff',
    fontSize: 14,
    marginRight: spacing.sm,
  },
});
