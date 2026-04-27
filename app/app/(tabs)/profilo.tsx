import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Section } from '@/components/Section';
import { Slider } from '@/components/Slider';
import { useAuthStore } from '@/store/authStore';
import { useQuizStore } from '@/store/quizStore';
import { useSchoolsStore } from '@/store/schoolsStore';
import { computeAffinity } from '@/lib/matching';
import { getSchoolByIdSync } from '@/services/mockBackend';
import { UserValues } from '@/types';
import { colors, fontFamily, radius, shadow, spacing } from '@/theme';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const result = useQuizStore((s) => s.result);
  const overrideValues = useQuizStore((s) => s.overrideValues);
  const resetQuiz = useQuizStore((s) => s.reset);
  const savedSchools = useSchoolsStore((s) => s.savedSchools);

  const initialValues = useMemo<UserValues>(
    () =>
      result?.values ?? {
        logica: 50,
        creativita: 50,
        socialita: 50,
        praticita: 50,
        umanistica: 50,
      },
    [result]
  );

  const [values, setValues] = useState<UserValues>(initialValues);

  const update = (k: keyof UserValues, v: number) => {
    const next = { ...values, [k]: v };
    setValues(next);
    overrideValues(next);
  };

  const insight = useMemo(() => {
    const entries = (Object.keys(values) as (keyof UserValues)[])
      .map((k) => ({ k, v: values[k] }))
      .sort((a, b) => b.v - a.v);
    const top = entries[0];
    const bottom = entries[entries.length - 1];
    const labels: Record<keyof UserValues, string> = {
      logica: 'logica',
      creativita: 'creatività',
      socialita: 'socialità',
      praticita: 'praticità',
      umanistica: 'cultura umanistica',
    };
    return `Il tuo punto forte è la ${labels[top.k]}, mentre la ${labels[bottom.k]} ha più margine. Considera percorsi che valorizzino il primo aspetto.`;
  }, [values]);

  const onLogout = () => {
    Alert.alert('Esci', 'Vuoi davvero uscire?', [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'Esci',
        style: 'destructive',
        onPress: async () => {
          await logout();
          resetQuiz();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Profilo</Text>
          <Pressable onPress={onLogout} style={styles.logoutBtn}>
            <MaterialIcons name="logout" size={18} color={colors.text} />
          </Pressable>
        </View>

        <Card style={styles.profileCard}>
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {(user?.name ?? 'S').slice(0, 1).toUpperCase()}
            </Text>
          </LinearGradient>
          <Text style={styles.name}>{user?.name ?? 'Studente'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
          <View style={styles.tagsRow}>
            <Chip
              label={user?.pathType === 'medie' ? 'Terza Media' : 'Quinta Superiore'}
              variant="soft"
              size="sm"
            />
            {result?.indirizzo && <Chip label={result.indirizzo} variant="outline" size="sm" />}
          </View>
        </Card>

        <Section title="I tuoi valori AI" hint="Tocca per regolare manualmente">
          <Card>
            <Slider
              leftLabel="Creatività"
              rightLabel="Tecnica"
              value={100 - values.creativita}
              onChange={(v) => update('creativita', 100 - v)}
            />
            <Slider
              leftLabel="Lavoro di squadra"
              rightLabel="Autonomia"
              value={100 - values.socialita}
              onChange={(v) => update('socialita', 100 - v)}
            />
            <Slider
              leftLabel="Studio Pratico"
              rightLabel="Studio Teorico"
              value={100 - values.praticita}
              onChange={(v) => update('praticita', 100 - v)}
            />
          </Card>
        </Section>

        <Section title="Le tue 5 dimensioni">
          <Card>
            {([
              ['logica', 'Logica analitica'],
              ['creativita', 'Creatività'],
              ['socialita', 'Socialità'],
              ['praticita', 'Praticità'],
              ['umanistica', 'Cultura umanistica'],
            ] as [keyof UserValues, string][]).map(([k, label]) => (
              <View key={k} style={styles.dimRow}>
                <Text style={styles.dimLabel}>{label}</Text>
                <View style={styles.dimBarTrack}>
                  <View style={[styles.dimBarFill, { width: `${values[k]}%` }]} />
                </View>
                <Text style={styles.dimValue}>{values[k]}</Text>
              </View>
            ))}
          </Card>
        </Section>

        <Section title="Scuole preferite" hint={`${savedSchools.length} salvate`}>
          {savedSchools.length === 0 ? (
            <Card>
              <Text style={styles.empty}>
                Nessuna scuola salvata. Tap sull'icona segnalibro nei dettagli scuola per aggiungerla.
              </Text>
            </Card>
          ) : (
            savedSchools.map((sv) => {
              const sch = getSchoolByIdSync(sv.schoolId);
              if (!sch) return null;
              const matchValuesScore = computeAffinity(values, sch.valuesProfile);
              return (
                <Card
                  key={sv.schoolId}
                  onPress={() => router.push(`/school/${sv.schoolId}`)}
                  style={{ marginBottom: spacing.sm }}
                >
                  <View style={styles.savedRow}>
                    <LinearGradient
                      colors={[sch.hero.color1, sch.hero.color2]}
                      style={styles.savedThumb}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.savedName}>{sch.name}</Text>
                      <Text style={styles.savedCity}>{sch.city}</Text>
                    </View>
                    <View style={styles.matchPill}>
                      <Text style={styles.matchText}>{matchValuesScore}%</Text>
                    </View>
                  </View>
                </Card>
              );
            })
          )}
        </Section>

        <Section title="AI Insight">
          <Card style={styles.insightCard}>
            <View style={styles.insightHead}>
              <MaterialIcons name="auto-awesome" size={18} color={colors.primary} />
              <Text style={styles.insightTitle}>Suggerimento del Mentor</Text>
            </View>
            <Text style={styles.insightText}>{insight}</Text>
          </Card>
        </Section>

        <Pressable onPress={() => { resetQuiz(); router.push('/(onboarding)/quiz'); }} style={styles.retakeBtn}>
          <MaterialIcons name="refresh" size={16} color={colors.primary} />
          <Text style={styles.retakeText}>Rifai il quiz</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgSoft },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontFamily: fontFamily.display, fontSize: 24, color: colors.text },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginTop: spacing.lg,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadow.fab,
  },
  avatarText: { fontFamily: fontFamily.display, color: '#fff', fontSize: 32 },
  name: { fontFamily: fontFamily.display, fontSize: 22, color: colors.text },
  email: { fontFamily: fontFamily.body, color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  tagsRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: spacing.md },
  dimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dimLabel: { width: 130, fontFamily: fontFamily.bodyMedium, fontSize: 12, color: colors.textSecondary },
  dimBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSoft,
    overflow: 'hidden',
    marginHorizontal: spacing.sm,
  },
  dimBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  dimValue: { width: 30, textAlign: 'right', fontFamily: fontFamily.bodyBold, fontSize: 12, color: colors.text },
  savedRow: { flexDirection: 'row', alignItems: 'center' },
  savedThumb: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    marginRight: spacing.md,
  },
  savedName: { fontFamily: fontFamily.bodyBold, color: colors.text, fontSize: 14 },
  savedCity: { fontFamily: fontFamily.body, color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  matchPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
  },
  matchText: { fontFamily: fontFamily.bodyBold, color: colors.primary, fontSize: 12 },
  insightCard: { borderColor: colors.primaryLight, borderWidth: 2 },
  insightHead: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  insightTitle: {
    marginLeft: spacing.sm,
    fontFamily: fontFamily.bodyBold,
    fontSize: 14,
    color: colors.text,
  },
  insightText: {
    fontFamily: fontFamily.body,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  empty: {
    fontFamily: fontFamily.body,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    marginTop: spacing.xl,
  },
  retakeText: {
    marginLeft: 6,
    fontFamily: fontFamily.bodyBold,
    color: colors.primary,
    fontSize: 13,
  },
});
