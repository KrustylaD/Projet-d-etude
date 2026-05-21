import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={[Colors.forest, Colors.black]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <TouchableOpacity
              onPress={() => router.push('/edit-profile')}
              activeOpacity={0.85}
              style={styles.avatarTouch}
            >
              <View style={styles.avatarContainer}>
                {user?.photo_url ? (
                  <Image source={{ uri: user.photo_url }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person" size={48} color={Colors.lime} />
                )}
              </View>
              <View style={styles.editBadge}>
                <Ionicons name="pencil" size={14} color={Colors.black} />
              </View>
            </TouchableOpacity>
            <Text style={styles.userName}>{user?.display_name || 'Utilisateur'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            {user?.farm_name && (
              <View style={styles.farmBadge}>
                <Ionicons name="home" size={16} color={Colors.lime} />
                <Text style={styles.farmName}>{user.farm_name}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => router.push('/edit-profile')}
              activeOpacity={0.85}
            >
              <Ionicons name="create-outline" size={18} color={Colors.lime} />
              <Text style={styles.editProfileButtonText}>Modifier le profil</Text>
            </TouchableOpacity>
          </View>

          {/* Account Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations du compte</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoLabel}>
                  <Ionicons name="mail-outline" size={20} color={Colors.creamLow} />
                  <Text style={styles.infoLabelText}>Email</Text>
                </View>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>

              {user?.phone_number && (
                <View style={[styles.infoRow, styles.infoRowBorder]}>
                  <View style={styles.infoLabel}>
                    <Ionicons name="call-outline" size={20} color={Colors.creamLow} />
                    <Text style={styles.infoLabelText}>Téléphone</Text>
                  </View>
                  <Text style={styles.infoValue}>{user.phone_number}</Text>
                </View>
              )}

              {user?.location && (
                <View style={[styles.infoRow, styles.infoRowBorder]}>
                  <View style={styles.infoLabel}>
                    <Ionicons name="location-outline" size={20} color={Colors.creamLow} />
                    <Text style={styles.infoLabelText}>Localisation</Text>
                  </View>
                  <Text style={styles.infoValue}>{user.location}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Sécurité */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sécurité</Text>

            <View style={styles.menuCard}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/change-password')}
                activeOpacity={0.7}
              >
                <Ionicons name="key-outline" size={24} color={Colors.lime} />
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>Changer le mot de passe</Text>
                  <Text style={styles.menuItemSubtitle}>Modifier votre mot de passe actuel</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.cream50} />
              </TouchableOpacity>
            </View>
          </View>

          {/* App Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>À propos</Text>

            <View style={styles.menuCard}>
              <View style={styles.menuItem}>
                <Ionicons name="leaf" size={24} color={Colors.lime} />
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>AgriScan AI</Text>
                  <Text style={styles.menuItemSubtitle}>Version 1.0.0</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.menuItem, styles.menuItemBorder]}
                onPress={() => router.push('/help-support')}
                activeOpacity={0.7}
              >
                <Ionicons name="information-circle-outline" size={24} color={Colors.info} />
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>Aide & Support</Text>
                  <Text style={styles.menuItemSubtitle}>Besoin d&apos;assistance ?</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.cream50} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, styles.menuItemBorder]}
                onPress={() => router.push('/legal-notices')}
                activeOpacity={0.7}
              >
                <Ionicons name="shield-checkmark-outline" size={24} color={Colors.warning} />
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>Confidentialité</Text>
                  <Text style={styles.menuItemSubtitle}>Politique de confidentialité</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.cream50} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, styles.menuItemBorder]}
                onPress={() => router.push('/legal-notices')}
                activeOpacity={0.7}
              >
                <Ionicons name="document-text-outline" size={24} color={Colors.creamLow} />
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>Mentions légales</Text>
                  <Text style={styles.menuItemSubtitle}>Informations légales</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.cream50} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={24} color={Colors.error} />
            <Text style={styles.logoutButtonText}>Déconnexion</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            © 2025 AgriScan AI - Tous droits réservés
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarTouch: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.card,
    borderWidth: 3,
    borderColor: Colors.lime60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.lime,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.forest,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.cream,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.creamLow,
  },
  farmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  farmName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.lime,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.lime08,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.lime60,
  },
  editProfileButtonText: {
    color: Colors.lime,
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.cream,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRow: {
    paddingVertical: 12,
  },
  infoRowBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  infoLabelText: {
    fontSize: 14,
    color: Colors.creamLow,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: Colors.cream,
    paddingLeft: 28,
  },
  menuCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuItemBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.cream,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: Colors.creamLow,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.error12,
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
    borderWidth: 2,
    borderColor: Colors.error,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.error,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.cream50,
    marginTop: 32,
  },
});
