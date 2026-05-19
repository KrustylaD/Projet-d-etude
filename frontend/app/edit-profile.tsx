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
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();

  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [farmName, setFarmName] = useState(user?.farm_name || '');
  const [location, setLocation] = useState(user?.location || '');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(user?.photo_url);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      // Vérification des permissions
      const { status: existingStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status, canAskAgain } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        finalStatus = status;

        if (status !== 'granted') {
          if (!canAskAgain) {
            Alert.alert(
              'Permission requise',
              "L'accès aux photos est nécessaire pour choisir une image de profil. Activez-le dans les réglages.",
              [
                { text: 'Annuler', style: 'cancel' },
                {
                  text: 'Ouvrir les réglages',
                  onPress: () => {
                    // Linking.openSettings() pourrait être utilisé ici si nécessaire
                  },
                },
              ]
            );
          }
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
        base64: true,
      });

      if (!result.canceled && result.assets[0]?.base64) {
        const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setPhotoUrl(base64);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Erreur', "Impossible de sélectionner l'image");
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Erreur', 'Le pseudo ne peut pas être vide');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        display_name: displayName.trim(),
        phone_number: phoneNumber.trim() || undefined,
        farm_name: farmName.trim() || undefined,
        location: location.trim() || undefined,
        photo_url: photoUrl,
      });

      Alert.alert('Succès', 'Profil mis à jour avec succès !', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de mettre à jour le profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1a2f1a', '#0a1a0a', '#000000']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <Ionicons name="close" size={28} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Modifier le profil</Text>
            <TouchableOpacity
              onPress={handleSave}
              style={styles.headerButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#4ade80" size="small" />
              ) : (
                <Text style={styles.saveText}>Enregistrer</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {/* Avatar */}
            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={styles.avatarTouch}>
                <View style={styles.avatarContainer}>
                  {photoUrl ? (
                    <Image source={{ uri: photoUrl }} style={styles.avatarImage} />
                  ) : (
                    <Ionicons name="person" size={56} color="#4ade80" />
                  )}
                </View>
                <View style={styles.cameraOverlay}>
                  <Ionicons name="camera" size={20} color="#000" />
                </View>
              </TouchableOpacity>
              <Text style={styles.avatarHint}>Appuyer pour changer la photo</Text>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Pseudo *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color="#a3a3a3" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Votre pseudo"
                    placeholderTextColor="#666"
                    value={displayName}
                    onChangeText={setDisplayName}
                    maxLength={40}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Téléphone</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={20} color="#a3a3a3" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="+33 6 12 34 56 78"
                    placeholderTextColor="#666"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Nom de la ferme</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="home-outline" size={20} color="#a3a3a3" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Ferme du Soleil"
                    placeholderTextColor="#666"
                    value={farmName}
                    onChangeText={setFarmName}
                    maxLength={60}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Localisation</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="location-outline" size={20} color="#a3a3a3" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ville, région"
                    placeholderTextColor="#666"
                    value={location}
                    onChangeText={setLocation}
                    maxLength={80}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <View style={[styles.inputWrapper, styles.inputDisabled]}>
                  <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.inputDisabledText]}
                    value={user?.email}
                    editable={false}
                  />
                </View>
                <Text style={styles.fieldHint}>L'email ne peut pas être modifié</Text>
              </View>
            </View>

            {/* Big Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={22} color="#000" />
                  <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
    borderBottomColor: '#1a1a1a',
  },
  headerButton: {
    minWidth: 80,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  saveText: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarTouch: {
    position: 'relative',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1a1a1a',
    borderWidth: 3,
    borderColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0a1a0a',
  },
  avatarHint: {
    color: '#a3a3a3',
    fontSize: 13,
    marginTop: 12,
  },
  form: {
    gap: 16,
  },
  field: {
    marginBottom: 4,
  },
  label: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    paddingVertical: 14,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  inputDisabledText: { color: '#a3a3a3' },
  fieldHint: {
    color: '#666',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4ade80',
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 32,
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});
