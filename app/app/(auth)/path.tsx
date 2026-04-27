import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Logo } from '@/components/Logo';
import { useAuthStore } from '@/store/authStore';
import { PathType } from '@/types';
import { colors, fontFamily, radius, spacing } from '@/theme';

const OPTIONS: { id: PathType; title: string; subtitle: string; icon: 'school' | 'workspace-premium'; color1: string; color2: string }[] = [
  {
    id: 'medie',
    title: 'Scuole Medie',
    subtitle: 'Sto per iniziare le superiori',
    icon: 'school',
    color1: '#066CF4',
    color2: '#7B5CFF',
  },
  {
    id: 'superiori',
    title: 'Scuole Superiori',
    subtitle: "Sto per iniziare l'università",
    icon: 'workspace-premium',
    color1: '#22C55E',
    color2: '#066CF4',
  },
];

export default function PathScreen() {
  const [selected, setSelected] = useState<PathType | null>(null);
  const setPath = useAuthStore((s) => s.setPath);

  const onContinue = () => {
    if (!selected) return;
    setPath(selected);
    router.replace('/(onboarding)/quiz');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Logo size="sm" />
        </View>

        <Text style={styles.title}>Quale percorso{'\n'}hai appena concluso?</Text>
        <Text style={styles.subtitle}>
          Ti aiuteremo a scegliere il prossimo passo, in base ai tuoi interessi e ai tuoi valori.
        </Text>

        <View style={styles.cards}>
          {OPTIONS.map((opt) => {
            const active = selected === opt.id;
            return (
              <Card
                key={opt.id}
                onPress={() => setSelected(opt.id)}
                style={{ marginBottom: spacing.md, borderColor: active ? colors.primary : colors.border, borderWidth: active ? 2 : 1 }}
              >
                <View style={styles.cardRow}>
                  <LinearGradient
                    colors={[opt.color1, opt.color2]}
                    style={styles.iconWrap}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialIcons name={opt.icon} size={28} color="#fff" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{opt.title}</Text>
                    <Text style={styles.cardSubtitle}>→ {opt.subtitle}</Text>
                  </View>
                  <View
                    style={[
                      styles.radio,
                      active && { borderColor: colors.primary, backgroundColor: colors.primary },
                    ]}
                  >
                    {active && <MaterialIcons name="check" size={14} color="#fff" />}
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        <Button label="Continua" onPress={onContinue} disabled={!selected} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.xl, flexGrow: 1 },
  header: { marginBottom: spacing.xl },
  title: {
    fontFamily: fontFamily.display,
    fontSize: 30,
    lineHeight: 36,
    color: colors.text,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  cards: { marginBottom: spacing.xxl },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  cardTitle: { fontFamily: fontFamily.bodyBold, fontSize: 17, color: colors.text },
  cardSubtitle: { fontFamily: fontFamily.body, fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
