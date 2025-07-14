import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SplashScreen } from '@/components/SplashScreen';

export default function Index() {
  const { loading, isAuthenticated, onboardingCompleted } = useAuth();
  const { isLanguageLoaded } = useLanguage();

  useEffect(() => {
    if (!loading && isLanguageLoaded) {
      if (isAuthenticated && onboardingCompleted) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(onboarding)/splash');
      }
    }
  }, [loading, isAuthenticated, onboardingCompleted, isLanguageLoaded]);

  return (
    <View style={styles.container}>
      <SplashScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});