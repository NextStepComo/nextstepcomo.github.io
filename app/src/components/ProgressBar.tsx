import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, radius, spacing } from '@/theme';

interface Props {
  step: number;
  total: number;
  label?: string;
}

export function ProgressBar({ step, total, label }: Props) {
  const pct = total === 0 ? 0 : Math.min(100, Math.max(0, (step / total) * 100));
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>
          {label ?? `Step ${Math.min(step, total)} di ${total}`}
        </Text>
        <Text style={styles.pct}>{Math.round(pct)}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  label: { fontFamily: fontFamily.bodySemibold, fontSize: 12, color: colors.textSecondary },
  pct: { fontFamily: fontFamily.bodyBold, fontSize: 12, color: colors.primary },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSoft,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.pill },
});
