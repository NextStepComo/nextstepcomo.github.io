import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '@/theme';

interface Props {
  size?: number;
  style?: ViewStyle;
}

/**
 * Sfondo decorativo con blob colorati morbidi, come da brief PDF (Login screen).
 */
export function AvatarBlob({ size = 220, style }: Props) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]}>
      <View
        style={[
          styles.blob,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.blob1,
            top: -size * 0.3,
            left: -size * 0.2,
            opacity: 0.18,
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          {
            width: size * 0.9,
            height: size * 0.9,
            borderRadius: size / 2,
            backgroundColor: colors.blob2,
            top: size * 0.1,
            right: -size * 0.3,
            opacity: 0.14,
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          {
            width: size * 1.1,
            height: size * 1.1,
            borderRadius: size,
            backgroundColor: colors.blob3,
            bottom: -size * 0.4,
            left: size * 0.05,
            opacity: 0.1,
          },
        ]}
      />
      <View
        style={[
          styles.blob,
          {
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: size / 2,
            backgroundColor: colors.blob4,
            bottom: size * 0.05,
            right: -size * 0.1,
            opacity: 0.12,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: { position: 'absolute' },
});
