import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontFamily, radius, spacing } from '@/theme';

interface Props {
  badge?: string;
  title: string;
  subtitle?: string;
  colors1?: string;
  colors2?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function Hero({
  badge,
  title,
  subtitle,
  colors1,
  colors2,
  style,
  children,
}: Props) {
  return (
    <LinearGradient
      colors={[colors1 ?? colors.primary, colors2 ?? colors.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.hero, style]}
    >
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    paddingTop: spacing.xl,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
  },
  badgeText: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 11,
    color: '#fff',
    letterSpacing: 0.6,
  },
  title: {
    fontFamily: fontFamily.display,
    fontSize: 28,
    lineHeight: 34,
    color: '#fff',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },
});
