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
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, BorderRadius, Spacing } from '../../src/constants/theme';
import AppDialog from '../../src/components/AppDialog';

const AgriScanLogo = ({ size = 60 }: { size?: number }) => (
  <View style={[signupStyles.logoContainer, { width: size, height: size, borderRadius: BorderRadius.squircle }]}>
    <Ionicons name="leaf" size={size * 0.5} color={Colors.lime} />
  </View>
);

const signupStyles = StyleSheet.create({
  logoContainer: {
    backgroundColor: Colors.forest,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cream08,
  },
});

export default function SignupScreen() {
  const router = useRouter();
  const { signup, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; message: string } | null>(null);

  const handleSignup = async () => {
    if (!email || !password || !displayName) {
      setDialog({ title: 'Erreur', message: 'Veuillez remplir tous les champs obligatoires' });
      return;
    }

    if (password.length < 6) {
      setDialog({ title: 'Erreur', message: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    try {
      await signup(email, password, displayName, farmName);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      setDialog({ title: "Erreur d'inscription", message: error.message || 'Une erreur est survenue' });
    }
  };

  return (
    <LinearGradient colors={[Colors.forest, Colors.black, Colors.black]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.content}>
              <View style={styles.header}>
                <AgriScanLogo />
                <Text style={styles.title}>Créer un compte</Text>
                <Text style={styles.subtitle}>Rejoignez AgriScan<Text style={styles.titleAccent}>.ai</Text></Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#a3a3a3" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nom complet *"
                    placeholderTextColor="#666"
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoComplete="name"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#a3a3a3" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email *"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#a3a3a3" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Mot de passe (min 6 caractères) *"
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color="#a3a3a3"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Ionicons name="home-outline" size={20} color="#a3a3a3" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nom de l'exploitation (optionnel)"
                    placeholderTextColor="#666"
                    value={farmName}
                    onChangeText={setFarmName}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleSignup}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Text style={styles.buttonText}>S&apos;inscrire</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => router.back()}
                  disabled={isLoading}
                >
                  <Text style={styles.linkText}>
                    Déjà un compte ? <Text style={styles.linkTextBold}>Se connecter</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, justifyContent: 'center', padding: Spacing.xl, paddingTop: Spacing.xxxl, paddingBottom: Spacing.xxxl },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
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
    height: 56,
  },
  inputIcon: { marginRight: Spacing.md },
  input: { flex: 1, height: 56, color: Colors.cream, fontSize: Typography.body },
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
