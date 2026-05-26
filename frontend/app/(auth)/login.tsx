import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, BorderRadius, Spacing } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import AppDialog from '../../src/components/AppDialog';

const AgriScanLogo = ({ size = 60 }: { size?: number }) => (
  <View style={[styles.logoContainer, { width: size, height: size, borderRadius: BorderRadius.squircle }]}>
    <Ionicons name="leaf" size={size * 0.5} color={Colors.lime} />
  </View>
);

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; message: string } | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setDialog({ title: 'Erreur', message: 'Veuillez remplir tous les champs' });
      return;
    }

    try {
      await login(email, password);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      setDialog({ title: 'Erreur de connexion', message: error.message || 'Email ou mot de passe incorrect' });
    }
  };

  return (
    <LinearGradient colors={[Colors.forest, Colors.black, Colors.black]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <View style={styles.content}>
            <View style={styles.header}>
              <AgriScanLogo />
              <Text style={styles.title}>AgriScan<Text style={styles.titleAccent}>.ai</Text></Text>
              <Text style={styles.subtitle}>Connexion à votre compte</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={Colors.cream40} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={Colors.cream30}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.cream40} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mot de passe"
                  placeholderTextColor={Colors.cream30}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={Colors.cream40} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.black} />
                ) : (
                  <Text style={styles.buttonText}>Se connecter</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push('/(auth)/signup')}
                disabled={isLoading}
              >
                <Text style={styles.linkText}>
                   Pas de compte ? <Text style={styles.linkTextBold}>S&apos;inscrire</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <AppDialog
        visible={dialog !== null}
        title={dialog?.title ?? ''}
        message={dialog?.message ?? ''}
        icon="⚠️"
        actions={[{ text: 'OK', onPress: () => setDialog(null) }]}
        onDismiss={() => setDialog(null)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: Spacing.xl },
  header: { alignItems: 'center', marginBottom: Spacing.xxxl },
  logoContainer: {
    backgroundColor: Colors.forest,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cream08,
  },
  title: {
    fontSize: Typography.h1,
    fontWeight: Typography.extrabold as any,
    color: Colors.cream,
    marginTop: Spacing.lg,
    letterSpacing: -0.5,
  },
  titleAccent: { color: Colors.lime },
  subtitle: { fontSize: Typography.body, color: Colors.cream50, marginTop: Spacing.sm },
  form: { width: '100%' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.slate,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cream15,
    height: 44,
  },
  inputIcon: { marginRight: Spacing.md },
  input: { flex: 1, height: 44, color: Colors.cream, fontSize: Typography.body },
  eyeIcon: { padding: Spacing.sm },
  button: {
    backgroundColor: Colors.lime,
    borderRadius: BorderRadius.md,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
    shadowColor: Colors.lime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: Colors.black,
    fontSize: Typography.h4,
    fontWeight: Typography.medium as any,
    letterSpacing: 0.4,
    textTransform: 'uppercase' as any,
  },
  linkButton: { marginTop: Spacing.xl, alignItems: 'center' },
  linkText: { color: Colors.cream40, fontSize: Typography.body },
  linkTextBold: { color: Colors.lime, fontWeight: Typography.medium as any },
});
