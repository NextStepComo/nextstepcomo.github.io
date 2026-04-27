import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { useAuthStore } from '@/store/authStore';
import { useQuizStore } from '@/store/quizStore';
import { useSchoolsStore } from '@/store/schoolsStore';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [storesReady, setStoresReady] = useState(false);
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydrateQuiz = useQuizStore((s) => s.hydrate);
  const hydrateSchools = useSchoolsStore((s) => s.hydrate);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_700Bold,
    PlusJakartaSans_600SemiBold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    Promise.all([hydrateAuth(), hydrateQuiz(), hydrateSchools()]).then(() =>
      setStoresReady(true)
    );
  }, [hydrateAuth, hydrateQuiz, hydrateSchools]);

  useEffect(() => {
    if (fontsLoaded && storesReady) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, storesReady]);

  if (!fontsLoaded || !storesReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'fade',
        }}
      />
    </GestureHandlerRootView>
  );
}
