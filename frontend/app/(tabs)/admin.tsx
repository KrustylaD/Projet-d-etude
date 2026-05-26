import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import { Colors } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import {
  AdminStatsOverview,
  AdminUser,
  AdminDiagnosticItem,
  AdminUsersResponse,
} from '../../src/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AsynconfBanner } from '../../src/components/AsynconfBanner';

type Section = 'stats' | 'users' | 'diagnostics';

export default function AdminScreen() {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState<Section>('stats');
  const [stats, setStats] = useState<AdminStatsOverview | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [diagnostics, setDiagnostics] = useState<AdminDiagnosticItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [cultureFilter, setCultureFilter] = useState('');

  const fetchStats = useCallback(async (): Promise<AdminStatsOverview> => {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/admin/stats?user_id=${user!.uid}`
    );
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }, [user]);

  const fetchUsers = useCallback(async (): Promise<AdminUser[]> => {
    let url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/admin/users?user_id=${user!.uid}&limit=50&offset=0`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch users');
    const data = await res.json() as AdminUsersResponse;
    setTotalUsers(data.total);
    return data.users;
  }, [user, search]);

  const fetchDiagnostics = useCallback(async (): Promise<AdminDiagnosticItem[]> => {
    let url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/admin/diagnostics?user_id=${user!.uid}`;
    if (cultureFilter) url += `&culture=${encodeURIComponent(cultureFilter)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch diagnostics');
    return res.json();
  }, [user, cultureFilter]);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (activeSection === 'stats') {
        const data = await fetchStats();
        setStats(data);
      } else if (activeSection === 'users') {
        const data = await fetchUsers();
        setUsers(data);
      } else {
        const data = await fetchDiagnostics();
        setDiagnostics(data);
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  }, [user, activeSection, fetchStats, fetchUsers, fetchDiagnostics]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      if (activeSection === 'stats') {
        const data = await fetchStats();
        setStats(data);
      } else if (activeSection === 'users') {
        const data = await fetchUsers();
        setUsers(data);
      } else {
        const data = await fetchDiagnostics();
        setDiagnostics(data);
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setRefreshing(false);
    }
  }, [user, activeSection, fetchStats, fetchUsers, fetchDiagnostics]);

  const sections: { key: Section; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'stats', label: 'Statistiques', icon: 'stats-chart' },
    { key: 'users', label: 'Utilisateurs', icon: 'people' },
    { key: 'diagnostics', label: 'Diagnostics', icon: 'document-text' },
  ];

  const renderStats = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.lime} />
        </View>
      );
    }
    if (!stats) return null;
    const cards = [
      { icon: 'people' as const, value: stats.total_users, label: 'Utilisateurs' },
      { icon: 'analytics' as const, value: stats.total_diagnostics, label: 'Diagnostics' },
      { icon: 'chatbubbles' as const, value: stats.total_messages, label: 'Messages' },
      { icon: 'notifications' as const, value: stats.total_alerts, label: 'Alertes' },
    ];
    return (
      <View style={styles.statsGrid}>
        {cards.map((card) => (
          <View key={card.label} style={styles.statCard}>
            <Ionicons name={card.icon} size={32} color={Colors.lime} />
            <Text style={styles.statValue}>{card.value}</Text>
            <Text style={styles.statLabel}>{card.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderUsers = () => (
    <View>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par email ou nom..."
        placeholderTextColor={Colors.creamLow}
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={loadData}
        returnKeyType="search"
      />
      {!loading && (
        <Text style={styles.totalCount}>Total : {totalUsers} utilisateurs</Text>
      )}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.lime} />
        </View>
      ) : users.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color={Colors.cream50} />
          <Text style={styles.emptyText}>Aucun utilisateur trouvé</Text>
        </View>
      ) : (
        users.map((u) => (
          <View key={u.uid} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <Ionicons name="person" size={24} color={Colors.lime} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{u.display_name}</Text>
                <Text style={styles.cardSubtitle}>{u.email}</Text>
              </View>
              <View style={[styles.roleBadge, { backgroundColor: u.role === 'admin' ? Colors.lime15 : Colors.warning15 }]}>
                <Text style={[styles.roleText, { color: u.role === 'admin' ? Colors.lime : Colors.warning }]}>
                  {u.role}
                </Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.cardMeta}>
                {u.diagnostic_count} diagnostic{u.diagnostic_count !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderDiagnostics = () => (
    <View>
      <TextInput
        style={styles.searchInput}
        placeholder="Filtrer par culture..."
        placeholderTextColor={Colors.creamLow}
        value={cultureFilter}
        onChangeText={setCultureFilter}
        onSubmitEditing={loadData}
        returnKeyType="search"
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.lime} />
        </View>
      ) : diagnostics.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="folder-open-outline" size={64} color={Colors.cream50} />
          <Text style={styles.emptyText}>Aucun diagnostic trouvé</Text>
        </View>
      ) : (
        diagnostics.map((d) => (
          <View key={d.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <Ionicons name="leaf" size={24} color={Colors.lime} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{d.culture}</Text>
                <Text style={styles.cardSubtitle}>{d.user_display_name} — {d.user_email}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusBg(d.status) }]}>
                <Text style={[styles.statusText, { color: getStatusColor(d.status) }]}>{d.status}</Text>
              </View>
            </View>
            <Text style={styles.cardBody} numberOfLines={2}>{d.symptoms}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardMeta}>
                {format(new Date(d.created_at), 'PPP', { locale: fr })}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

  if (user?.role !== 'admin') return <Redirect href="/(tabs)/profile" />;

  return (
    <LinearGradient colors={[Colors.forest, Colors.black]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Administration</Text>
          <Ionicons name="shield-checkmark" size={28} color={Colors.lime} />
        </View>

        <AsynconfBanner />

        <View style={styles.segmentedControl}>
          {sections.map((s) => (
            <TouchableOpacity
              key={s.key}
              style={[styles.segmentButton, activeSection === s.key && styles.segmentButtonActive]}
              onPress={() => setActiveSection(s.key)}
            >
              <Ionicons
                name={s.icon}
                size={16}
                color={activeSection === s.key ? Colors.lime : Colors.creamLow}
              />
              <Text style={[styles.segmentText, activeSection === s.key && styles.segmentTextActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.lime} />
          }
        >
          {activeSection === 'stats' && renderStats()}
          {activeSection === 'users' && renderUsers()}
          {activeSection === 'diagnostics' && renderDiagnostics()}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function getStatusBg(status: string): string {
  switch (status) {
    case 'traité': return Colors.success15;
    case 'surveillance': return Colors.info15;
    default: return Colors.warning15;
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'traité': return Colors.success;
    case 'surveillance': return Colors.info;
    default: return Colors.warning;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.cream,
  },
  segmentedControl: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  segmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  segmentButtonActive: {
    backgroundColor: Colors.lime,
    borderColor: Colors.lime,
  },
  segmentText: {
    color: Colors.creamLow,
    fontSize: 13,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: Colors.black,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 4,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.lime,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.creamLow,
    fontWeight: '500',
  },
  searchInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  totalCount: {
    fontSize: 13,
    color: Colors.creamLow,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.lime08,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.cream,
  },
  cardSubtitle: {
    fontSize: 12,
    color: Colors.creamLow,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    fontSize: 14,
    color: Colors.creamLow,
    lineHeight: 20,
    marginTop: 12,
  },
  cardFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cardMeta: {
    fontSize: 12,
    color: Colors.creamLow,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    color: Colors.cream50,
    fontSize: 16,
    marginTop: 16,
  },
});
