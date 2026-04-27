import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Redirect href="/(auth)/login" />;
  if (!user.pathType) return <Redirect href="/(auth)/path" />;
  if (!user.quizCompleted) return <Redirect href="/(onboarding)/quiz" />;
  return <Redirect href="/(tabs)/dashboard" />;
}
