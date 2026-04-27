import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ChatBubble } from '@/components/ChatBubble';
import { Chip } from '@/components/Chip';
import { aiTutorReply } from '@/services/mockGemini';
import { ChatMessage } from '@/types';
import { colors, fontFamily, radius, spacing } from '@/theme';

const SUBJECTS = ['Informatica', 'Matematica', 'Fisica', 'Scienze', 'Inglese'];

export default function TutorScreen() {
  const [subject, setSubject] = useState<string>('Informatica');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listenMode, setListenMode] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setMessages([]);
    void send('', subject, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  const send = async (textInput: string, subj: string, intro = false) => {
    setLoading(true);
    const next: ChatMessage[] = intro
      ? []
      : [
          ...messages,
          {
            id: `m-${Date.now()}`,
            role: 'user',
            text: textInput,
            timestamp: Date.now(),
          },
        ];
    setMessages(next);
    setInput('');
    const reply = await aiTutorReply(subj, next, textInput);
    setMessages((cur) => [
      ...cur,
      { id: `r-${Date.now()}`, role: 'ai', text: reply, timestamp: Date.now() },
    ]);
    setLoading(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const onSubmit = () => {
    const v = input.trim();
    if (!v || loading) return;
    void send(v, subject);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <MaterialIcons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tutorAvatar}
          >
            <MaterialIcons name="auto-awesome" size={16} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={styles.headerTitle}>Tutor AI</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>online · {subject}</Text>
            </View>
          </View>
        </View>
        <Pressable
          onPress={() => setListenMode((v) => !v)}
          style={[styles.iconBtn, listenMode && { backgroundColor: colors.primary }]}
        >
          <MaterialIcons
            name="volume-up"
            size={20}
            color={listenMode ? '#fff' : colors.text}
          />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subjects}
      >
        {SUBJECTS.map((s) => (
          <Chip key={s} label={s} active={s === subject} onPress={() => setSubject(s)} size="sm" />
        ))}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.chat}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((m) => (
            <ChatBubble key={m.id} role={m.role} text={m.text} />
          ))}
          {loading && <ChatBubble role="ai" text="" loading />}
        </ScrollView>

        <View style={styles.inputBar}>
          <Pressable style={styles.micBtn}>
            <MaterialIcons name="mic" size={20} color={colors.textSecondary} />
          </Pressable>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={`Chiedi qualcosa di ${subject}…`}
            placeholderTextColor={colors.textMuted}
            onSubmitEditing={onSubmit}
            style={styles.input}
            multiline
          />
          <Pressable onPress={onSubmit} style={styles.sendBtn} disabled={loading}>
            <MaterialIcons name="send" size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.bgSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.md },
  tutorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerTitle: { fontFamily: fontFamily.bodyBold, color: colors.text, fontSize: 15 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success, marginRight: 6 },
  statusText: { fontFamily: fontFamily.body, fontSize: 11, color: colors.textSecondary },
  subjects: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  chat: { paddingTop: spacing.md, paddingBottom: spacing.lg },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.bg,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: colors.bgSoft,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: fontFamily.body,
    fontSize: 14,
    color: colors.text,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});
