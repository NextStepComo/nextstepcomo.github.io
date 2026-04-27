import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, fontFamily, radius, spacing } from '@/theme';

interface Props {
  role: 'user' | 'ai';
  text: string;
  loading?: boolean;
}

export function ChatBubble({ role, text, loading }: Props) {
  const isUser = role === 'user';
  return (
    <View
      style={[
        styles.row,
        { justifyContent: isUser ? 'flex-end' : 'flex-start' },
      ]}
    >
      {!isUser && (
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          style={styles.avatar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialIcons name="auto-awesome" size={16} color="#fff" />
        </LinearGradient>
      )}
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAi,
          { borderBottomLeftRadius: isUser ? radius.lg : 4, borderBottomRightRadius: isUser ? 4 : radius.lg },
        ]}
      >
        {loading ? (
          <Text style={[styles.text, !isUser && { color: colors.textSecondary }]}>
            …sto pensando
          </Text>
        ) : (
          <Text style={[styles.text, isUser ? { color: '#fff' } : { color: colors.text }]}>
            {text}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '78%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.lg,
  },
  bubbleAi: { backgroundColor: colors.bubbleAi },
  bubbleUser: { backgroundColor: colors.bubbleUser },
  text: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 21 },
});
