import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, fontFamily, radius, spacing } from '@/theme';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  size?: 'sm' | 'md';
  variant?: 'default' | 'soft' | 'outline';
}

export function Chip({
  label,
  active,
  onPress,
  style,
  size = 'md',
  variant = 'default',
}: Props) {
  const padV = size === 'sm' ? 6 : 10;
  const padH = size === 'sm' ? 12 : 16;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.chip,
        { paddingVertical: padV, paddingHorizontal: padH },
        variant === 'default' && (active ? styles.activeFill : styles.defaultFill),
        variant === 'soft' && styles.softFill,
        variant === 'outline' && styles.outlineFill,
        pressed && onPress && { transform: [{ scale: 0.97 }] },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { fontSize: size === 'sm' ? 12 : 14 },
          variant === 'default' && (active ? { color: '#fff' } : { color: colors.text }),
          variant === 'soft' && { color: colors.primary },
          variant === 'outline' && { color: colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  defaultFill: {
    backgroundColor: colors.bgSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFill: { backgroundColor: colors.primary },
  softFill: { backgroundColor: colors.primaryLight },
  outlineFill: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { fontFamily: fontFamily.bodySemibold },
});
