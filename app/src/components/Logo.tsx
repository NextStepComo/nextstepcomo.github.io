import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontFamily, radius } from '@/theme';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  style?: ViewStyle;
}

export function Logo({ size = 'md', showText = true, style }: Props) {
  const dim = size === 'sm' ? 28 : size === 'md' ? 40 : 56;
  const fontSize = size === 'sm' ? 14 : size === 'md' ? 20 : 28;
  const iconSize = size === 'sm' ? 18 : size === 'md' ? 24 : 32;

  return (
    <View style={[styles.row, style]}>
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={[
          styles.icon,
          { width: dim, height: dim, borderRadius: radius.md },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialIcons name="rocket-launch" size={iconSize} color="#fff" />
      </LinearGradient>
      {showText && (
        <Text style={[styles.text, { fontSize }]}>
          Next<Text style={{ color: colors.primary }}>Step</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  text: { fontFamily: fontFamily.display, color: colors.text, letterSpacing: -0.5 },
});
