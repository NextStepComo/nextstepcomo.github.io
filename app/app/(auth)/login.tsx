import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { AvatarBlob } from '@/components/AvatarBlob';
import { Logo } from '@/components/Logo';
import { useAuthStore } from '@/store/authStore';
import { colors, fontFamily, radius, spacing } from '@/theme';

export default function LoginScreen() {
  const [mode, setMode] = useState<'idle' | 'email'>('idle');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<'google' | 'email' | null>(null);

  const loginGoogle = useAuthStore((s) => s.loginWithGoogle);
  const loginEmail = useAuthStore((s) => s.loginWithEmail);

  const handleGoogle = async () => {
    setLoading('google');
    await loginGoogle();
    setLoading(null);
    router.replace('/(auth)/path');
  };

  const handleEmail = async () => {
    if (!email.includes('@')) return;
    setLoading('email');
    await loginEmail(email);
    setLoading(null);
    router.replace('/(auth)/path');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AvatarBlob size={360} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Logo size="lg" />
          </View>

          <View style={styles.heroBlock}>
            <Text style={styles.welcome}>Trova il tuo prossimo passo.</Text>
            <Text style={styles.sub}>
              Un percorso personalizzato per scegliere scuola e università, costruito intorno a te.
            </Text>
          </View>

          <View style={styles.actions}>
            {mode === 'idle' ? (
              <>
                <Button
                  variant="secondary"
                  label="Continua con Google"
                  loading={loading === 'google'}
                  onPress={handleGoogle}
                  icon={
                    <View style={styles.googleIcon}>
                      <Text style={styles.googleG}>G</Text>
                    </View>
                  }
                />
                <View style={{ height: spacing.md }} />
                <Button
                  variant="primary"
                  label="Accedi con Email"
                  onPress={() => setMode('email')}
                  icon={<MaterialIcons name="mail-outline" size={18} color="#fff" />}
                />
              </>
            ) : (
              <View>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  placeholder="tuonome@email.it"
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                />
                <View style={{ height: spacing.md }} />
                <Button
                  label="Continua"
                  loading={loading === 'email'}
                  onPress={handleEmail}
                  disabled={!email.includes('@')}
                />
                <Button
                  variant="ghost"
                  label="← Torna indietro"
                  onPress={() => setMode('idle')}
                  fullWidth={false}
                  style={{ alignSelf: 'center', marginTop: spacing.sm }}
                />
              </View>
            )}
          </View>

          <Text style={styles.terms}>
            Continuando accetti i Termini di servizio e la Privacy Policy. Demo offline:
            nessun dato lascia il dispositivo.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  header: { marginTop: spacing.lg },
  heroBlock: { marginTop: spacing.xxxl, marginBottom: spacing.xxl },
  welcome: {
    fontFamily: fontFamily.display,
    fontSize: 34,
    lineHeight: 40,
    color: colors.text,
    marginBottom: spacing.md,
  },
  sub: {
    fontFamily: fontFamily.body,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  actions: { marginTop: 'auto', marginBottom: spacing.xl },
  label: {
    fontFamily: fontFamily.bodySemibold,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    height: 52,
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    fontFamily: fontFamily.bodyMedium,
    fontSize: 15,
    color: colors.text,
  },
  terms: {
    fontFamily: fontFamily.body,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  googleIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  googleG: {
    fontFamily: fontFamily.bodyBold,
    color: '#4285F4',
    fontSize: 14,
    lineHeight: 16,
  },
});
