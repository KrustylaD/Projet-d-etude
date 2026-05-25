import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../src/constants/theme';

interface AdminStat {
  id: string;
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface UserEntry {
  id: string;
  email: string;
  name: string;
  farm: string;
  diagnostics: number;
  status: 'actif' | 'inactif';
  role: 'admin' | 'farmer';
}

const mockUsers: UserEntry[] = [
  { id: '1', email: 'admin@agriscan.ai', name: 'Admin AgriScan', farm: 'Exploitation Centrale', diagnostics: 0, status: 'actif', role: 'admin' },
  { id: '2', email: 'pierre.dupont@mail.com', name: 'Pierre Dupont', farm: 'Ferme du Val', diagnostics: 12, status: 'actif', role: 'farmer' },
  { id: '3', email: 'marie.martin@mail.com', name: 'Marie Martin', farm: 'Domaine St-Jean', diagnostics: 8, status: 'actif', role: 'farmer' },
  { id: '4', email: 'jean.luc@mail.com', name: 'Jean-Luc Moreau', farm: 'GAEC du Moulin', diagnostics: 3, status: 'inactif', role: 'farmer' },
  { id: '5', email: 'agri.gauthier@mail.com', name: 'Sophie Gauthier', farm: 'EARL Gauthier', diagnostics: 15, status: 'actif', role: 'farmer' },
];

const adminStats: AdminStat[] = [
  { id: 'users', label: 'Utilisateurs', value: '48', icon: 'people', color: Colors.lime },
  { id: 'diags', label: 'Diagnostics', value: '327', icon: 'scan', color: Colors.info },
  { id: 'api', label: 'Appels API IA', value: '892', icon: 'code-slash', color: Colors.success },
  { id: 'uptime', label: 'Uptime', value: '99,8%', icon: 'cloud-done', color: Colors.warning },
];

function UserRow({ user }: { user: UserEntry }) {
  return (
    <View style={bStyles.userRow}>
      <View style={bStyles.userInfo}>
        <View style={[bStyles.avatar, { backgroundColor: user.role === 'admin' ? Colors.warning15 : Colors.lime10 }]}>
          <Ionicons
            name={user.role === 'admin' ? 'shield-checkmark' : 'leaf'}
            size={18}
            color={user.role === 'admin' ? Colors.warning : Colors.lime}
          />
        </View>
        <View style={bStyles.userText}>
          <Text style={bStyles.userName}>
            {user.name}
            {user.role === 'admin' && (
              <Text style={bStyles.adminTag}> ADMIN</Text>
            )}
          </Text>
          <Text style={bStyles.userEmail}>{user.email}</Text>
          <Text style={bStyles.userFarm}>{user.farm}</Text>
        </View>
      </View>
      <View style={bStyles.userMeta}>
        <Text style={bStyles.userDiags}>{user.diagnostics} diags</Text>
        <View style={[bStyles.userStatus, { backgroundColor: user.status === 'actif' ? Colors.success15 : Colors.cream10 }]}>
          <Text style={[bStyles.userStatusText, { color: user.status === 'actif' ? Colors.success : Colors.cream50 }]}>
            {user.status}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function BackofficeScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={[Colors.forest, Colors.black]} style={bStyles.container}>
      <SafeAreaView style={bStyles.safeArea}>
        <View style={bStyles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={bStyles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color={Colors.creamLow} />
          </TouchableOpacity>
          <Text style={bStyles.headerTitle}>Administration</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={bStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={bStyles.section}>
            <Ionicons name="settings-outline" size={48} color={Colors.warning} />
            <Text style={bStyles.sectionTitle}>Back-Office AgriScan</Text>
            <Text style={bStyles.sectionSub}>
              Gestion de la plateforme, utilisateurs et modèles IA
            </Text>
          </View>

          {/* Admin Stats */}
          <Text style={bStyles.cardSectionTitle}>Vue d&apos;ensemble</Text>
          <View style={bStyles.statsGrid}>
            {adminStats.map((stat) => (
              <View key={stat.id} style={bStyles.statCard}>
                <Ionicons name={stat.icon} size={24} color={stat.color} />
                <Text style={[bStyles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={bStyles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Gestion des modèles IA */}
          <Text style={bStyles.cardSectionTitle}>Modèles IA</Text>
          <View style={bStyles.card}>
            <View style={bStyles.modelRow}>
              <View style={[bStyles.iconCircle, { backgroundColor: Colors.success15 }]}>
                <Ionicons name="pulse-outline" size={22} color={Colors.success} />
              </View>
              <View style={bStyles.modelInfo}>
                <Text style={bStyles.modelName}>GPT-5.2 — Diagnostic végétal</Text>
                <Text style={bStyles.modelDetail}>Prompt pathologie · Accuracy 93% · 892 appels</Text>
              </View>
              <View style={[bStyles.modelStatus, { backgroundColor: Colors.success15 }]}>
                <Text style={[bStyles.modelStatusText, { color: Colors.success }]}>Actif</Text>
              </View>
            </View>
          </View>

          {/* Gestion des utilisateurs */}
          <Text style={bStyles.cardSectionTitle}>Utilisateurs</Text>
          <View style={bStyles.card}>
            {mockUsers.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </View>

          <TouchableOpacity style={bStyles.noteCard} activeOpacity={0.8}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.info} />
            <Text style={bStyles.noteText}>
              Back-office accessible aux administrateurs AgriScan. Gestion des comptes, supervision des
              diagnostics et configuration des modèles IA en un clic.
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const bStyles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 48 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card,
  },
  closeButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.cream },
  section: { alignItems: 'center', marginBottom: 24, paddingTop: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.cream, marginTop: 12 },
  sectionSub: { fontSize: 14, color: Colors.creamLow, textAlign: 'center', marginTop: 6 },
  cardSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.cream,
    marginBottom: 12,
    marginTop: 8,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  statValue: { fontSize: 28, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: Colors.creamLow },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelInfo: { flex: 1 },
  modelName: { fontSize: 15, fontWeight: '600', color: Colors.cream },
  modelDetail: { fontSize: 12, color: Colors.creamLow, marginTop: 2 },
  modelStatus: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  modelStatusText: { fontSize: 12, fontWeight: '700' },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 10,
  },
  userInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  userText: { flex: 1 },
  userName: { fontSize: 14, fontWeight: '600', color: Colors.cream },
  adminTag: { fontSize: 12, fontWeight: '800', color: Colors.warning },
  userEmail: { fontSize: 12, color: Colors.creamLow, marginTop: 1 },
  userFarm: { fontSize: 11, color: Colors.cream50, marginTop: 1 },
  userMeta: { alignItems: 'flex-end', gap: 4, flexShrink: 0 },
  userDiags: { fontSize: 12, fontWeight: '700', color: Colors.lime },
  userStatus: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  userStatusText: { fontSize: 10, fontWeight: '700' },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'flex-start',
    marginTop: 4,
  },
  noteText: { flex: 1, fontSize: 13, color: Colors.creamLow, lineHeight: 20 },
});
