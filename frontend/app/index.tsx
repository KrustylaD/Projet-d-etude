import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, BorderRadius } from '../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const AgriScanLogo = ({ size = 88 }: { size?: number }) => (
  <View style={[styles.logoContainer, { width: size, height: size, borderRadius: BorderRadius.squircle }]}>
    <Ionicons name="leaf" size={size * 0.5} color={Colors.lime} />
  </View>
);

export default function Index() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(auth)/login');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return (
    <LinearGradient
      colors={[Colors.forest, Colors.black, Colors.black]}
      style={styles.container}
    >
      {/* Glow effect */}
      <View style={styles.glowEffect} />
      
      <View style={styles.content}>
        <AgriScanLogo size={88} />
        <Text style={styles.title}>
          AgriScan<Text style={styles.titleAccent}>.ai</Text>
        </Text>
        <Text style={styles.subtitle}>Diagnostic IA des maladies des plantes</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glowEffect: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    width: 300,
    height: 300,
    marginLeft: -150,
    marginTop: -150,
    borderRadius: 150,
    backgroundColor: Colors.lime,
    opacity: 0.04,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    backgroundColor: Colors.forest,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cream08,
    shadowColor: Colors.lime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 20,
  },
  title: {
    fontSize: Typography.displayXL,
    fontWeight: Typography.extrabold as any,
    color: Colors.cream,
    marginTop: 24,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  titleAccent: {
    color: Colors.lime,
  },
  subtitle: {
    fontSize: Typography.body,
    color: Colors.cream50,
    marginTop: 8,
    textAlign: 'center',
  },
});
