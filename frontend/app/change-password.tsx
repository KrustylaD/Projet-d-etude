import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../src/constants/theme';
import AppDialog, { DialogAction } from '../src/components/AppDialog';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { updatePassword } = useAuthStore();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; message: string; icon?: string; actions?: DialogAction[] } | null>(null);

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setDialog({ title: 'Erreur', message: 'Veuillez remplir tous les champs' });
      return;
    }
    if (newPassword.length < 6) {
      setDialog({ title: 'Erreur', message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setDialog({ title: 'Erreur', message: 'Les nouveaux mots de passe ne correspondent pas' });
      return;
    }
    if (oldPassword === newPassword) {
      setDialog({ title: 'Erreur', message: "Le nouveau mot de passe doit être différent de l'ancien" });
      return;
    }

    setLoading(true);
    try {
      await updatePassword(oldPassword, newPassword);
      setDialog({
        title: 'Succès',
        message: 'Mot de passe modifié avec succès !',
        icon: '🔑',
        actions: [{ text: 'OK', onPress: () => router.back() }],
      });
    } catch (error: any) {
      setDialog({ title: 'Erreur', message: error.message || 'Impossible de changer le mot de passe' });
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordInput = (
    value: string,
    onChange: (v: string) => void,
    placeholder: string,
    show: boolean,
    toggleShow: () => void
  ) => (
    <View style={styles.inputWrapper}>
      <Ionicons name="lock-closed-outline" size={20} color={Colors.creamLow} style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.cream50}
        value={value}
        onChangeText={onChange}
        secureTextEntry={!show}
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={toggleShow} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.creamLow} />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={[Colors.forest, Colors.black]} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <Ionicons name="close" size={28} color={Colors.cream} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mot de passe</Text>
            <View style={styles.headerButton} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.iconHeader}>
              <View style={styles.iconBubble}>
                <Ionicons name="shield-checkmark" size={36} color={Colors.lime} />
              </View>
              <Text style={styles.subtitle}>
                Choisissez un mot de passe sûr (6 caractères minimum)
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Ancien mot de passe</Text>
                {renderPasswordInput(
                  oldPassword,
                  setOldPassword,
                  'Votre mot de passe actuel',
                  showOld,
                  () => setShowOld(!showOld)
                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Nouveau mot de passe</Text>
                {renderPasswordInput(
                  newPassword,
                  setNewPassword,
                  'Au moins 6 caractères',
                  showNew,
                  () => setShowNew(!showNew)
                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Confirmer le nouveau</Text>
                {renderPasswordInput(
                  confirmPassword,
                  setConfirmPassword,
                  'Retapez le nouveau',
                  showConfirm,
                  () => setShowConfirm(!showConfirm)
                )}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={Colors.black} />
              ) : (
                <>
                  <Ionicons name="key" size={20} color={Colors.black} />
                  <Text style={styles.saveButtonText}>Mettre à jour le mot de passe</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <AppDialog
        visible={dialog !== null}
        title={dialog?.title ?? ''}
        message={dialog?.message ?? ''}
        icon={dialog?.icon ?? '⚠️'}
        actions={dialog?.actions ?? [{ text: 'OK', onPress: () => setDialog(null) }]}
        onDismiss={() => setDialog(null)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card,
  },
  headerButton: { width: 44, height: 40, justifyContent: 'center' },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.cream,
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  iconHeader: {
    alignItems: 'center',
    marginVertical: 24,
  },
  iconBubble: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.lime12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subtitle: {
    color: Colors.creamLow,
    fontSize: 14,
    marginTop: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: { gap: 16 },
  field: { marginBottom: 4 },
  label: {
    color: Colors.cream,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    color: Colors.cream,
    fontSize: 16,
    paddingVertical: 14,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.lime,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 32,
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: '700',
  },
});
