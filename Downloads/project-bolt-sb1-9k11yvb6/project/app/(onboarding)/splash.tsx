import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { SplashScreen } from '@/components/SplashScreen';

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(onboarding)/intro');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

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