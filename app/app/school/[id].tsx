import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Card } from '@/components/Card';
import { Section } from '@/components/Section';
import { getSchoolByIdSync } from '@/services/mockBackend';
import { useSchoolsStore } from '@/store/schoolsStore';
import { useQuizStore } from '@/store/quizStore';
import { computeMatchScore } from '@/lib/matching';
import { colors, fontFamily, radius, shadow, spacing } from '@/theme';

export default function SchoolDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const school = id ? getSchoolByIdSync(String(id)) : null;
  const result = useQuizStore((s) => s.result);

  const isSaved = useSchoolsStore((s) => s.isSaved(String(id)));
  const isOpendaySaved = useSchoolsStore((s) => s.isOpendaySaved);
  const toggleSchool = useSchoolsStore((s) => s.toggleSchool);
  const toggleOpenday = useSchoolsStore((s) => s.toggleOpenday);

  const [openYear, setOpenYear] = useState<number | null>(null);

  const match = useMemo(() => {
    if (!school || !result) return null;
    return computeMatchScore(result.values, school, null);
  }, [school, result]);

  if (!school) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Scuola non trovata</Text>
          <Button label="Torna indietro" onPress={() => router.back()} fullWidth={false} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <LinearGradient
            colors={[school.hero.color1, school.hero.color2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroTop}>
              <Pressable onPress={() => router.back()} style={styles.iconBtn}>
                <MaterialIcons name="arrow-back" size={20} color="#fff" />
              </Pressable>
              <Pressable
                onPress={() => toggleSchool(school.id, match?.matchScore ?? 0)}
                style={styles.iconBtn}
              >
                <MaterialIcons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color="#fff"
                />
              </Pressable>
            </View>
            <View style={styles.heroBody}>
              <Text style={styles.heroType}>{school.type.toUpperCase()}</Text>
              <Text style={styles.heroName}>{school.name}</Text>
              <Text style={styles.heroAddr}>
                {school.city} · {school.address}
              </Text>
              {match && (
                <View style={styles.matchPill}>
                  <MaterialIcons name="auto-awesome" size={14} color="#fff" />
                  <Text style={styles.matchText}>Match {match.matchScore}%</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        <View style={styles.actionsRow}>
          <Button
            label={isSaved ? 'Salvata' : 'Segui'}
            variant={isSaved ? 'secondary' : 'primary'}
            onPress={() => toggleSchool(school.id, match?.matchScore ?? 0)}
            fullWidth={false}
            style={{ flex: 1, marginRight: spacing.sm }}
            icon={
              <MaterialIcons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={16}
                color={isSaved ? colors.text : '#fff'}
              />
            }
          />
          <Button
            label="Prenota Colloquio"
            variant="secondary"
            fullWidth={false}
            style={{ flex: 1, marginLeft: spacing.sm }}
            icon={<MaterialIcons name="event-available" size={16} color={colors.text} />}
          />
        </View>

        <View style={styles.body}>
          <Section title="Su questa scuola">
            <Card>
              <Text style={styles.text}>{school.description}</Text>
            </Card>
          </Section>

          <Section title="Indirizzi disponibili">
            <View style={styles.chipRow}>
              {school.indirizzi.map((i) => (
                <Chip
                  key={i}
                  label={i}
                  variant={i === school.recommendedIndirizzo ? 'soft' : 'outline'}
                  size="md"
                />
              ))}
            </View>
            {school.recommendedIndirizzo && (
              <View style={styles.recommendBox}>
                <MaterialIcons name="auto-awesome" size={14} color={colors.primary} />
                <Text style={styles.recommendText}>
                  Suggerito per te: <Text style={{ fontFamily: fontFamily.bodyBold }}>{school.recommendedIndirizzo}</Text>
                </Text>
              </View>
            )}
          </Section>

          <Section title="Piano di studi" hint="Tap su un anno per espanderlo">
            {school.pianoStudi.map((y) => {
              const expanded = openYear === y.anno;
              return (
                <Card
                  key={y.anno}
                  onPress={() => setOpenYear(expanded ? null : y.anno)}
                  style={{ marginBottom: spacing.sm }}
                >
                  <View style={styles.yearHead}>
                    <Text style={styles.yearTitle}>{y.anno}° anno</Text>
                    <MaterialIcons
                      name={expanded ? 'expand-less' : 'expand-more'}
                      size={20}
                      color={colors.textMuted}
                    />
                  </View>
                  {expanded && (
                    <View style={{ marginTop: spacing.sm }}>
                      {y.materie.map((m) => (
                        <View key={m.nome} style={styles.subjectRow}>
                          <Text style={styles.subjectName}>{m.nome}</Text>
                          <Text style={styles.subjectHours}>{m.ore}h/sett</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </Card>
              );
            })}
          </Section>

          <Section title="Strutture e laboratori">
            <View style={styles.chipRow}>
              {school.strutture.map((s) => (
                <Chip key={s} label={s} variant="outline" size="sm" />
              ))}
            </View>
          </Section>

          {school.opendays.length > 0 && (
            <Section title="Open Day">
              {school.opendays.map((od) => {
                const saved = isOpendaySaved(school.id, od.id);
                return (
                  <Card key={od.id} style={{ marginBottom: spacing.sm }}>
                    <View style={styles.opendayRow}>
                      <View style={styles.opendayDate}>
                        <Text style={styles.opendayDay}>
                          {new Date(od.date).getDate()}
                        </Text>
                        <Text style={styles.opendayMonth}>
                          {new Date(od.date)
                            .toLocaleDateString('it-IT', { month: 'short' })
                            .toUpperCase()}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.opendayTitle}>{od.descrizione}</Text>
                        <Text style={styles.opendayMeta}>{od.ora}</Text>
                      </View>
                      <Pressable
                        onPress={() => toggleOpenday(school.id, od.id)}
                        style={[
                          styles.opendayBtn,
                          saved && { backgroundColor: colors.primary },
                        ]}
                      >
                        <MaterialIcons
                          name={saved ? 'check' : 'add'}
                          size={18}
                          color={saved ? '#fff' : colors.primary}
                        />
                      </Pressable>
                    </View>
                  </Card>
                );
              })}
            </Section>
          )}

          <Section title="Statistiche">
            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>{school.stats.placement}%</Text>
                <Text style={styles.statLabel}>Placement</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>{school.stats.students.toLocaleString('it-IT')}</Text>
                <Text style={styles.statLabel}>Studenti</Text>
              </Card>
              {school.stats.studentRatio && (
                <Card style={styles.statCard}>
                  <Text style={styles.statValue}>1:{school.stats.studentRatio}</Text>
                  <Text style={styles.statLabel}>Doc / Studenti</Text>
                </Card>
              )}
            </View>
          </Section>

          <Section title="Posizione">
            <Card padded={false}>
              <View style={styles.miniMap}>
                <MaterialIcons name="map" size={32} color={colors.primary} />
                <Text style={styles.miniMapText}>{school.address}</Text>
                <Text style={styles.miniMapCity}>{school.city}</Text>
                <Pressable
                  onPress={() => router.push('/(tabs)/mappa')}
                  style={styles.miniMapBtn}
                >
                  <Text style={styles.miniMapBtnText}>Apri sulla mappa →</Text>
                </Pressable>
              </View>
            </Card>
          </Section>
        </View>

        <View style={styles.bottomCta}>
          <Button
            label="Chiedi al Tutor di una materia"
            onPress={() => router.push('/tutor')}
            icon={<MaterialIcons name="auto-awesome" size={16} color="#fff" />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgSoft },
  hero: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between' },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBody: { marginTop: spacing.lg },
  heroType: { fontFamily: fontFamily.bodyBold, color: 'rgba(255,255,255,0.85)', fontSize: 11, letterSpacing: 0.8 },
  heroName: { fontFamily: fontFamily.display, color: '#fff', fontSize: 26, marginTop: 6, lineHeight: 30 },
  heroAddr: { fontFamily: fontFamily.body, color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
  matchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
    marginTop: spacing.md,
  },
  matchText: { fontFamily: fontFamily.bodyBold, color: '#fff', fontSize: 12, marginLeft: 4 },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    marginBottom: spacing.md,
  },
  body: { paddingHorizontal: spacing.lg },
  text: { fontFamily: fontFamily.body, fontSize: 14, lineHeight: 21, color: colors.text },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  recommendBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },
  recommendText: {
    marginLeft: spacing.sm,
    fontFamily: fontFamily.body,
    color: colors.primary,
    fontSize: 13,
  },
  yearHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  yearTitle: { fontFamily: fontFamily.bodyBold, fontSize: 15, color: colors.text },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  subjectName: { fontFamily: fontFamily.bodyMedium, color: colors.text, fontSize: 13 },
  subjectHours: { fontFamily: fontFamily.bodySemibold, color: colors.textSecondary, fontSize: 12 },
  opendayRow: { flexDirection: 'row', alignItems: 'center' },
  opendayDate: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  opendayDay: { fontFamily: fontFamily.display, color: colors.primary, fontSize: 22 },
  opendayMonth: { fontFamily: fontFamily.bodyBold, color: colors.primary, fontSize: 10, letterSpacing: 0.5 },
  opendayTitle: { fontFamily: fontFamily.bodyBold, color: colors.text, fontSize: 13, lineHeight: 18 },
  opendayMeta: { fontFamily: fontFamily.body, color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  opendayBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { flex: 1, marginHorizontal: 4, alignItems: 'center', paddingVertical: spacing.lg },
  statValue: { fontFamily: fontFamily.display, fontSize: 22, color: colors.text },
  statLabel: { fontFamily: fontFamily.body, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  miniMap: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
  },
  miniMapText: { fontFamily: fontFamily.bodyBold, color: colors.text, fontSize: 14, marginTop: 8 },
  miniMapCity: { fontFamily: fontFamily.body, color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  miniMapBtn: { marginTop: spacing.md, paddingVertical: 6, paddingHorizontal: 14, backgroundColor: '#fff', borderRadius: radius.pill, ...shadow.card },
  miniMapBtnText: { fontFamily: fontFamily.bodyBold, color: colors.primary, fontSize: 12 },
  bottomCta: { padding: spacing.lg, paddingBottom: spacing.xxl },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyTitle: { fontFamily: fontFamily.display, fontSize: 22, color: colors.text, marginBottom: spacing.lg },
});
