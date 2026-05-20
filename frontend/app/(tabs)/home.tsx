import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stats, Diagnostic } from '../../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/stats/${user.uid}`
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <LinearGradient colors={['#1a2f1a', '#0a1a0a', '#000000']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4ade80" />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a2f1a', '#0a1a0a', '#000000']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#4ade80"
            />
          }
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Bonjour,</Text>
              <Text style={styles.userName}>{user?.display_name || 'Agriculteur'}</Text>
              {user?.farm_name && (
                <Text style={styles.farmName}>{user.farm_name}</Text>
              )}
            </View>
            <Ionicons name="leaf" size={40} color="#4ade80" />
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions rapides</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/(tabs)/diagnostic')}
              >
                <LinearGradient
                  colors={['#4ade80', '#22c55e']}
                  style={styles.actionGradient}
                >
                  <Ionicons name="chatbubbles" size={32} color="#000" />
                  <Text style={styles.actionText}>Nouveau{"\n"}Diagnostic</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/(tabs)/dashboard')}
              >
                <View style={styles.actionCardSecondary}>
                  <Ionicons name="stats-chart" size={32} color="#4ade80" />
                  <Text style={styles.actionTextSecondary}>Voir{"\n"}Statistiques</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Overview */}
          {stats && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Aperçu</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{stats.total_diagnostics}</Text>
                  <Text style={styles.statLabel}>Diagnostics</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{stats.status_breakdown.en_cours}</Text>
                  <Text style={styles.statLabel}>En cours</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{stats.unread_alerts}</Text>
                  <Text style={styles.statLabel}>Alertes</Text>
                </View>
              </View>
            </View>
          )}

          {/* Recent Diagnostics */}
          {stats && stats.recent_diagnostics.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Diagnostics récents</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/dashboard')}>
                  <Text style={styles.seeAllText}>Tout voir</Text>
                </TouchableOpacity>
              </View>
              {stats.recent_diagnostics.slice(0, 3).map((diagnostic) => (
                <TouchableOpacity
                  key={diagnostic.id}
                  style={styles.diagnosticCard}
                  onPress={() => router.navigate(`/(tabs)/diagnostic?id=${diagnostic.id}`)}
                >
                  <View style={styles.diagnosticHeader}>
                    <Ionicons name="leaf-outline" size={24} color="#4ade80" />
                    <View style={styles.diagnosticInfo}>
                      <Text style={styles.diagnosticCulture}>{diagnostic.culture}</Text>
                      <Text style={styles.diagnosticSymptoms} numberOfLines={1}>
                        {diagnostic.symptoms}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(diagnostic.status) }]}>
                      <Text style={styles.statusText}>{diagnostic.status}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'en cours':
      return '#fbbf24';
    case 'traité':
      return '#4ade80';
    case 'surveillance':
      return '#60a5fa';
    default:
      return '#666';
  }
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
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: '#a3a3a3',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  farmName: {
    fontSize: 14,
    color: '#4ade80',
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#4ade80',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionCardSecondary: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  actionText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionTextSecondary: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4ade80',
  },
  statLabel: {
    fontSize: 12,
    color: '#a3a3a3',
    marginTop: 4,
  },
  diagnosticCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  diagnosticHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  diagnosticInfo: {
    flex: 1,
  },
  diagnosticCulture: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  diagnosticSymptoms: {
    fontSize: 14,
    color: '#a3a3a3',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
});
