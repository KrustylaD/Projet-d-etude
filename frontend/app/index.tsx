import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Vérifier l'authentification après 1.5 secondes (splash screen)
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/login');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <LinearGradient
      colors={['#1a2f1a', '#0a1a0a', '#000000']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Ionicons name="leaf" size={80} color="#4ade80" />
        <Text style={styles.title}>AgriScan AI</Text>
        <Text style={styles.subtitle}>Diagnostic des maladies des plantes</Text>
        <ActivityIndicator size="large" color="#4ade80" style={styles.loader} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a3a3a3',
    marginTop: 8,
    textAlign: 'center',
  },
  loader: {
    marginTop: 32,
  },
});
