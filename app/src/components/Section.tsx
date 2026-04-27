import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fontFamily, spacing } from '@/theme';

interface Props {
  title: string;
  hint?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
  children: React.ReactNode;
}

export function Section({ title, hint, right, style, children }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {hint ? <Text style={styles.hint}>{hint}</Text> : null}
        </View>
        {right}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.xl },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  title: { fontFamily: fontFamily.displayMedium, fontSize: 18, color: colors.text },
  hint: { fontFamily: fontFamily.body, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});
