import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LatLng, haversineKm } from '@/lib/matching';
import { School } from '@/types';
import { colors, fontFamily, radius, spacing } from '@/theme';

interface Props {
  pos: LatLng | null;
  schools: School[];
  onSelect: (s: School) => void;
}

/**
 * Fallback web: la libreria nativa react-native-maps non gira sul web bundle.
 * Mostriamo un elenco con distanza e un avviso, mantenendo la stessa interazione.
 */
export default function MapViewImpl({ pos, schools, onSelect }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.list}>
      <View style={styles.header}>
        <MaterialIcons name="info-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.hint}>
          Vista mappa attiva su iOS / Android. Sul web mostriamo l'elenco scuole con distanza.
        </Text>
      </View>
      {schools.map((s) => {
        const km = pos ? haversineKm(pos, { lat: s.lat, lng: s.lng }) : null;
        return (
          <Pressable
            key={s.id}
            onPress={() => onSelect(s)}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
          >
            <View style={styles.pin}>
              <MaterialIcons name="place" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{s.name}</Text>
              <Text style={styles.meta}>
                {s.city} · {s.address}
              </Text>
            </View>
            {km != null && <Text style={styles.dist}>{km.toFixed(1)} km</Text>}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  hint: {
    marginLeft: spacing.sm,
    flex: 1,
    fontFamily: fontFamily.body,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  pin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  name: { fontFamily: fontFamily.bodyBold, color: colors.text, fontSize: 14 },
  meta: { fontFamily: fontFamily.body, color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  dist: { fontFamily: fontFamily.bodyBold, color: colors.primary, fontSize: 12 },
});
