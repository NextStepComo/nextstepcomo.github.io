import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Hero } from '@/components/Hero';
import { Chip } from '@/components/Chip';
import { Card } from '@/components/Card';
import { SchoolListItem } from '@/components/SchoolListItem';
import { Section } from '@/components/Section';
import { Logo } from '@/components/Logo';
import { useAuthStore } from '@/store/authStore';
import { useQuizStore } from '@/store/quizStore';
import { LatLng, rankSchools, ScoredSchool } from '@/lib/matching';
import schools from '@/data/schools.json';
import { School } from '@/types';
import { getFallbackLocation, getUserLocation } from '@/services/location';
import { colors, fontFamily, radius, spacing } from '@/theme';

const allSchools = schools as School[];

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const result = useQuizStore((s) => s.result);
  const [pos, setPos] = useState<LatLng | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let alive = true;
    getUserLocation().then((p) => {
      if (alive) setPos(p ?? getFallbackLocation());
    });
    return () => {
      alive = false;
    };
  }, []);

  const level: 'superiori' | 'universita' =
    user?.pathType === 'medie' ? 'superiori' : 'universita';

  const ranked = useMemo<ScoredSchool[]>(() => {
    if (!result) return [];
    return rankSchools(result.values, allSchools, pos, { level });
  }, [result, pos, level]);

  const visible = showAll ? ranked : ranked.slice(0, 4);

  if (!result) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.empty}>
          <Logo size="md" />
          <Text style={styles.emptyTitle}>Completa il quiz per vedere la dashboard</Text>
          <Text style={styles.emptySub}>
            Bastano poche minuti: il Mentor AI ti farà 6 domande per costruire il tuo profilo.
          </Text>
          <Pressable
            onPress={() => router.push('/(onboarding)/quiz')}
            style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}
          >
            <Text style={styles.ctaLabel}>Inizia il quiz</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#fff" />
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topbar}>
          <View>
            <Text style={styles.greet}>Ciao {user?.name?.split(' ')[0] ?? ''} 👋</Text>
            <Text style={styles.greetSub}>Ecco il tuo prossimo passo.</Text>
          </View>
          <Logo size="sm" showText={false} />
        </View>

        <Hero
          badge="IL TUO INDIRIZZO IDEALE"
          title={result.indirizzo}
          subtitle={result.perche}
        />

        <Section title="Perché questo indirizzo">
          <Card>
            <Text style={styles.body}>{result.perche}</Text>
            <View style={styles.chipsRow}>
              {result.traits.map((t) => (
                <Chip key={t} label={t} variant="soft" size="sm" />
              ))}
            </View>
          </Card>
        </Section>

        <Section title="Materie principali" hint="Le aree che incontrerai di più">
          <View style={styles.chipsRow}>
            {result.materie.slice(0, 6).map((m) => (
              <Chip key={m} label={m} variant="outline" />
            ))}
          </View>
        </Section>

        <Section
          title="Scuole nelle vicinanze"
          hint={`${ranked.length} risultati ordinati per match`}
          right={
            <Pressable onPress={() => router.push('/(tabs)/mappa')}>
              <Text style={styles.linkText}>Sulla mappa →</Text>
            </Pressable>
          }
        >
          {visible.map((s) => (
            <SchoolListItem
              key={s.school.id}
              scored={s}
              onPress={() => router.push(`/school/${s.school.id}`)}
            />
          ))}
          {ranked.length > 4 && (
            <Pressable
              onPress={() => setShowAll((v) => !v)}
              style={({ pressed }) => [styles.viewAll, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.viewAllText}>
                {showAll ? 'Mostra meno' : `Vedi tutte (${ranked.length})`}
              </Text>
            </Pressable>
          )}
        </Section>

        <Section title="Tutor AI" hint="Hai dubbi su una materia? Chiedi al tutor.">
          <Card onPress={() => router.push('/tutor')}>
            <View style={styles.tutorRow}>
              <View style={styles.tutorIcon}>
                <MaterialIcons name="auto-awesome" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tutorTitle}>Apri il Tutor AI</Text>
                <Text style={styles.tutorSub}>Informatica, Matematica, Fisica e altro</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={colors.textMuted} />
            </View>
          </Card>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgSoft },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  greet: { fontFamily: fontFamily.display, fontSize: 22, color: colors.text },
  greetSub: { fontFamily: fontFamily.body, fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  body: { fontFamily: fontFamily.body, fontSize: 14, color: colors.text, lineHeight: 21 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  linkText: { fontFamily: fontFamily.bodyBold, fontSize: 13, color: colors.primary },
  viewAll: {
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    marginTop: spacing.sm,
  },
  viewAllText: { fontFamily: fontFamily.bodyBold, color: colors.primary, fontSize: 13 },
  tutorRow: { flexDirection: 'row', alignItems: 'center' },
  tutorIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  tutorTitle: { fontFamily: fontFamily.bodyBold, color: colors.text, fontSize: 15 },
  tutorSub: { fontFamily: fontFamily.body, color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  empty: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontFamily: fontFamily.display,
    fontSize: 22,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  emptySub: {
    fontFamily: fontFamily.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    borderRadius: radius.pill,
  },
  ctaLabel: {
    fontFamily: fontFamily.bodyBold,
    color: '#fff',
    fontSize: 15,
    marginRight: spacing.sm,
  },
});
