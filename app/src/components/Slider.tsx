import React, { useState } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, fontFamily, radius, spacing } from '@/theme';

interface Props {
  leftLabel: string;
  rightLabel: string;
  value: number; // 0..100
  onChange?: (v: number) => void;
  readOnly?: boolean;
}

/**
 * Slider con due polarità (left/right) — il valore 0 = sinistra, 100 = destra.
 * Usato per i 5 valori del profilo nel Profilo / Dashboard.
 */
export function Slider({ leftLabel, rightLabel, value, onChange, readOnly }: Props) {
  const [w, setW] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);

  const updateFromX = (x: number) => {
    if (!w || !onChange) return;
    const pct = Math.max(0, Math.min(1, x / w));
    onChange(Math.round(pct * 100));
  };

  const responder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !readOnly,
      onMoveShouldSetPanResponder: () => !readOnly,
      onPanResponderGrant: (e: GestureResponderEvent) => {
        updateFromX(e.nativeEvent.locationX);
      },
      onPanResponderMove: (e: GestureResponderEvent) => {
        updateFromX(e.nativeEvent.locationX);
      },
    })
  ).current;

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{leftLabel}</Text>
        <Text style={styles.label}>{rightLabel}</Text>
      </View>
      <View
        style={styles.track}
        onLayout={onLayout}
        {...(readOnly ? {} : responder.panHandlers)}
      >
        <View style={[styles.fill, { width: `${value}%` }]} />
        <View style={[styles.thumb, { left: `${value}%` }]} />
      </View>
      <View style={styles.scoreRow}>
        <Text style={styles.score}>{value} / 100</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', marginBottom: spacing.lg },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: { fontFamily: fontFamily.bodySemibold, fontSize: 13, color: colors.textSecondary },
  track: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSoft,
    justifyContent: 'center',
  },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: colors.primary, borderRadius: radius.pill },
  thumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: colors.primary,
    marginLeft: -11,
    top: -6,
  },
  scoreRow: { alignItems: 'flex-end', marginTop: 4 },
  score: { fontFamily: fontFamily.bodyBold, fontSize: 12, color: colors.primary },
});
