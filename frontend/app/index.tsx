import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, BorderRadius } from '../src/constants/theme';
import Svg, { Path, Line } from 'react-native-svg';

const AgriScanLogo = ({ size = 88 }: { size?: number }) => (
  <View style={[styles.logoContainer, { width: size, height: size, borderRadius: BorderRadius.squircle }]}>
    <Svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8 6 4 10 4 14c0 4 3.5 7 8 7s8-3 8-7c0-4-4-8-8-12z"
        stroke={Colors.cream}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 2v19"
        stroke={Colors.cream}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1="5"
        y1="10"
        x2="19"
        y2="10"
        stroke={Colors.lime}
        strokeWidth="1.5"
        strokeDasharray="2 1.5"
        opacity="0.8"
      />
      <Line
        x1="6"
        y1="14"
        x2="18"
        y2="14"
        stroke={Colors.lime}
        strokeWidth="1.5"
        strokeDasharray="2 1.5"
        opacity="0.6"
      />
    </Svg>
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
  }, [isAuthenticated]);

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
