import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from './Card';
import { colors, fontFamily, radius, spacing } from '@/theme';
import { ScoredSchool } from '@/lib/matching';

interface Props {
  scored: ScoredSchool;
  onPress?: () => void;
}

export function SchoolListItem({ scored, onPress }: Props) {
  const { school, matchScore, distanceKm } = scored;
  return (
    <Card onPress={onPress} style={styles.card} padded={false}>
      <View style={styles.row}>
        <LinearGradient
          colors={[school.hero.color1, school.hero.color2]}
          style={styles.thumb}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.thumbType}>{school.type.split(' ')[0]}</Text>
        </LinearGradient>
        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={1}>
            {school.name}
          </Text>
          <Text style={styles.city} numberOfLines={1}>
            {school.city} · {school.address}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.matchPill}>
              <MaterialIcons name="auto-awesome" size={12} color={colors.primary} />
              <Text style={styles.matchText}>Match {matchScore}%</Text>
            </View>
            {distanceKm != null && (
              <Text style={styles.distance}>{distanceKm.toFixed(1)} km</Text>
            )}
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  thumbType: { fontFamily: fontFamily.bodyBold, color: '#fff', fontSize: 12, letterSpacing: 0.5 },
  body: { flex: 1 },
  name: { fontFamily: fontFamily.bodyBold, fontSize: 15, color: colors.text },
  city: { fontFamily: fontFamily.body, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  matchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  matchText: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 11,
    color: colors.primary,
    marginLeft: 4,
  },
  distance: {
    marginLeft: 8,
    fontFamily: fontFamily.bodySemibold,
    fontSize: 11,
    color: colors.textMuted,
  },
});
