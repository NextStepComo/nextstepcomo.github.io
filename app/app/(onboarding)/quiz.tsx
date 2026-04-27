import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { ChatBubble } from '@/components/ChatBubble';
import { Logo } from '@/components/Logo';
import { ProgressBar } from '@/components/ProgressBar';
import { quizQuestions } from '@/data/quizQuestions';
import { useAuthStore } from '@/store/authStore';
import { useQuizStore } from '@/store/quizStore';
import { colors, fontFamily, radius, spacing } from '@/theme';
import { aiGenerateQuizResult } from '@/services/mockGemini';

export default function QuizScreen() {
  const [submitting, setSubmitting] = useState(false);
  const user = useAuthStore((s) => s.user);
  const setQuizCompleted = useAuthStore((s) => s.setQuizCompleted);

  const step = useQuizStore((s) => s.step);
  const answers = useQuizStore((s) => s.answers);
  const answer = useQuizStore((s) => s.answer);
  const computeValues = useQuizStore((s) => s.computeValues);
  const setResult = useQuizStore((s) => s.setResult);
  const reset = useQuizStore((s) => s.reset);
  const goBack = useQuizStore((s) => s.goBack);

  const total = quizQuestions.length;
  const safeStep = Math.min(step, total - 1);
  const currentQ = quizQuestions[safeStep];

  const previousMessages = useMemo(() => {
    const messages: { id: string; role: 'user' | 'ai'; text: string }[] = [];
    for (let i = 0; i < step; i++) {
      const q = quizQuestions[i];
      const a = answers.find((x) => x.questionId === q?.id);
      const opt = q?.options.find((o) => o.id === a?.optionId);
      if (q) messages.push({ id: `q-${q.id}`, role: 'ai', text: q.text });
      if (opt) messages.push({ id: `a-${q?.id}`, role: 'user', text: opt.label });
    }
    return messages;
  }, [step, answers]);

  const onSelect = async (optionId: string) => {
    if (!currentQ) return;
    answer(currentQ.id, optionId);
    if (step + 1 >= total) {
      await finalize();
    }
  };

  const finalize = async () => {
    setSubmitting(true);
    const values = computeValues();
    const level = user?.pathType === 'medie' ? 'superiori' : 'universita';
    const result = await aiGenerateQuizResult(values, level);
    setResult(result);
    setQuizCompleted(true);
    setSubmitting(false);
    router.replace('/(tabs)/dashboard');
  };

  const onRestart = () => {
    reset();
  };

  const showCurrent = step < total && currentQ != null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topbar}>
        <Pressable onPress={() => (step > 0 ? goBack() : router.back())} style={styles.iconBtn}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Logo size="sm" showText />
        <Pressable onPress={onRestart} style={styles.iconBtn}>
          <MaterialIcons name="refresh" size={22} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.progressWrap}>
        <ProgressBar
          step={Math.min(step + 1, total)}
          total={total}
          label={`Domanda ${Math.min(step + 1, total)} di ${total}`}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.chat}
        showsVerticalScrollIndicator={false}
      >
        <ChatBubble
          role="ai"
          text={`Ciao ${user?.name?.split(' ')[0] ?? ''}! Sono il tuo Mentor AI. Ti farò ${total} domande per capire chi sei e suggerirti il percorso giusto.`}
        />
        {previousMessages.map((m) => (
          <ChatBubble key={m.id} role={m.role} text={m.text} />
        ))}
        {showCurrent && <ChatBubble role="ai" text={currentQ.text} />}
        {submitting && <ChatBubble role="ai" text="…analizzo le tue risposte" loading />}
      </ScrollView>

      {showCurrent && !submitting && (
        <View style={styles.options}>
          {currentQ.options.map((opt) => (
            <Pressable
              key={opt.id}
              onPress={() => onSelect(opt.id)}
              style={({ pressed }) => [
                styles.option,
                pressed && { transform: [{ scale: 0.99 }], borderColor: colors.primary },
              ]}
            >
              <Text style={styles.optionText}>{opt.label}</Text>
              <MaterialIcons name="arrow-forward" size={18} color={colors.primary} />
            </Pressable>
          ))}
        </View>
      )}

      {submitting && (
        <View style={styles.loadingBlock}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.loadingText}>Calcolo del tuo profilo…</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressWrap: { paddingHorizontal: spacing.xl, paddingBottom: spacing.md },
  chat: { paddingTop: spacing.md, paddingBottom: spacing.xl },
  options: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, paddingTop: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
  },
  optionText: {
    flex: 1,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 14,
    color: colors.text,
    marginRight: spacing.md,
    lineHeight: 20,
  },
  loadingBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    marginLeft: spacing.sm,
    fontFamily: fontFamily.bodyMedium,
    color: colors.textSecondary,
  },
});
