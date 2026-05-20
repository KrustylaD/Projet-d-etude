import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Colors } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stats, Diagnostic } from '../../src/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'expo-router';

type DiagnosticStatus = 'en cours' | 'traité' | 'surveillance';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | DiagnosticStatus>('all');
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch stats
      const statsResponse = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/stats/${user.uid}`
      );
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch all diagnostics
      const diagnosticsResponse = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/diagnostics/${user.uid}`
      );
      const diagnosticsData = await diagnosticsResponse.json();
      setDiagnostics(diagnosticsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const openDiagnostic = (diagnostic: Diagnostic) => {
    router.navigate(`/(tabs)/diagnostic?id=${diagnostic.id}`);
  };

  const confirmDelete = (diagnostic: Diagnostic) => {
    Alert.alert(
      'Supprimer ce diagnostic ?',
      `Le diagnostic de "${diagnostic.culture}" et tout son historique de conversation seront définitivement supprimés.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteDiagnostic(diagnostic.id),
        },
      ]
    );
  };

  const deleteDiagnostic = async (id: string) => {
    if (!user) return;
    setActioningId(id);
    try {
      const resp = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/diagnostics/${id}?user_id=${user.uid}`,
        { method: 'DELETE' }
      );
      if (!resp.ok) throw new Error('Suppression échouée');
      setDiagnostics((prev) => prev.filter((d) => d.id !== id));
      // Refresh stats
      fetchData();
    } catch (err) {
      console.error('Delete error', err);
      Alert.alert('Erreur', 'Impossible de supprimer ce diagnostic');
    } finally {
      setActioningId(null);
    }
  };

  const openStatusMenu = (diagnostic: Diagnostic) => {
    const options: DiagnosticStatus[] = ['en cours', 'traité', 'surveillance'];
    Alert.alert(
      'Changer le statut',
      `Statut actuel : ${diagnostic.status}`,
      [
        ...options
          .filter((s) => s !== diagnostic.status)
          .map((s) => ({
            text: statusLabel(s),
            onPress: () => updateStatus(diagnostic.id, s),
          })),
        { text: 'Annuler', style: 'cancel' as const },
      ]
    );
  };

  const updateStatus = async (id: string, status: DiagnosticStatus) => {
    if (!user) return;
    setActioningId(id);
    try {
      const resp = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/diagnostics/${id}/status?user_id=${user.uid}&status=${encodeURIComponent(status)}`,
        { method: 'PATCH' }
      );
      if (!resp.ok) throw new Error('Update échoué');
      const updated = await resp.json();
      setDiagnostics((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: updated.status } : d))
      );
      fetchData();
    } catch (err) {
      console.error('Status update error', err);
      Alert.alert('Erreur', 'Impossible de changer le statut');
    } finally {
      setActioningId(null);
    }
  };

  const filteredDiagnostics = diagnostics.filter(
    (d) => filter === 'all' || d.status === filter
  );

  if (loading) {
    return (
      <LinearGradient colors={['#1a2f1a', '#0a1a0a', '#000000']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.lime} />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a2f1a', '#0a1a0a', '#000000']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Ionicons name="stats-chart" size={28} color={Colors.lime} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.lime}
            />
          }
        >
          {/* Stats Cards */}
          {stats && (
            <View style={styles.statsContainer}>
              <View style={styles.statCardLarge}>
                <Ionicons name="analytics" size={32} color={Colors.lime} />
                <Text style={styles.statValueLarge}>{stats.total_diagnostics}</Text>
                <Text style={styles.statLabelLarge}>Total Diagnostics</Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statCardSmall}>
                  <Text style={styles.statValueSmall}>{stats.status_breakdown.en_cours}</Text>
                  <Text style={styles.statLabelSmall}>En cours</Text>
                  <View style={[styles.statusIndicator, { backgroundColor: Colors.warning }]} />
                </View>

                <View style={styles.statCardSmall}>
                  <Text style={styles.statValueSmall}>{stats.status_breakdown.traité}</Text>
                  <Text style={styles.statLabelSmall}>Traités</Text>
                  <View style={[styles.statusIndicator, { backgroundColor: Colors.lime }]} />
                </View>

                <View style={styles.statCardSmall}>
                  <Text style={styles.statValueSmall}>{stats.status_breakdown.surveillance}</Text>
                  <Text style={styles.statLabelSmall}>Surveillance</Text>
                  <View style={[styles.statusIndicator, { backgroundColor: Colors.info }]} />
                </View>
              </View>
            </View>
          )}

          {/* Filter Buttons */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                Tous ({diagnostics.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterButton, filter === 'en cours' && styles.filterButtonActive]}
              onPress={() => setFilter('en cours')}
            >
              <Text style={[styles.filterText, filter === 'en cours' && styles.filterTextActive]}>
                En cours ({stats?.status_breakdown.en_cours || 0})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterButton, filter === 'traité' && styles.filterButtonActive]}
              onPress={() => setFilter('traité')}
            >
              <Text style={[styles.filterText, filter === 'traité' && styles.filterTextActive]}>
                Traités ({stats?.status_breakdown.traité || 0})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterButton, filter === 'surveillance' && styles.filterButtonActive]}
              onPress={() => setFilter('surveillance')}
            >
              <Text style={[styles.filterText, filter === 'surveillance' && styles.filterTextActive]}>
                Surveillance ({stats?.status_breakdown.surveillance || 0})
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Diagnostics List */}
          <View style={styles.diagnosticsList}>
            {filteredDiagnostics.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="folder-open-outline" size={64} color={Colors.cream50} />
                <Text style={styles.emptyText}>Aucun diagnostic trouvé</Text>
              </View>
            ) : (
              filteredDiagnostics.map((diagnostic) => (
                <TouchableOpacity
                  key={diagnostic.id}
                  style={styles.diagnosticCard}
                  onPress={() => openDiagnostic(diagnostic)}
                  activeOpacity={0.85}
                >
                  <View style={styles.diagnosticCardHeader}>
                    <View style={styles.diagnosticIconContainer}>
                      <Ionicons name="leaf" size={24} color={Colors.lime} />
                    </View>
                    <View style={styles.diagnosticCardInfo}>
                      <Text style={styles.diagnosticCulture}>{diagnostic.culture}</Text>
                      <Text style={styles.diagnosticDate}>
                        {format(new Date(diagnostic.created_at), 'PPP', { locale: fr })}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation?.();
                        openStatusMenu(diagnostic);
                      }}
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusBadge(diagnostic.status).bg },
                      ]}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      {actioningId === diagnostic.id ? (
                        <ActivityIndicator size="small" color={getStatusBadge(diagnostic.status).text} />
                      ) : (
                        <>
                          <Text style={[styles.statusText, { color: getStatusBadge(diagnostic.status).text }]}>{diagnostic.status}</Text>
                          <Ionicons name="chevron-down" size={12} color={getStatusBadge(diagnostic.status).text} />
                        </>
                      )}
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.diagnosticSymptoms} numberOfLines={2}>
                    {diagnostic.symptoms}
                  </Text>

                  {diagnostic.diagnosis && (
                    <View style={styles.diagnosisContainer}>
                      <View style={styles.diagnosisHeader}>
                        <Ionicons name="medical" size={16} color={Colors.lime} />
                        <Text style={styles.diagnosisLabel}>Diagnostic:</Text>
                      </View>
                      <Text style={styles.diagnosisText}>{diagnostic.diagnosis}</Text>
                      {diagnostic.probability !== null && diagnostic.probability !== undefined && (
                        <View style={styles.probabilityContainer}>
                          <View style={styles.probabilityBar}>
                            <View
                              style={[
                                styles.probabilityFill,
                                { width: `${diagnostic.probability * 100}%` },
                              ]}
                            />
                          </View>
                          <Text style={styles.probabilityText}>
                            {Math.round(diagnostic.probability * 100)}%
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {diagnostic.treatment && (
                    <View style={styles.treatmentContainer}>
                      <Ionicons name="medical-outline" size={16} color={Colors.info} />
                      <Text style={styles.treatmentText} numberOfLines={2}>
                        {diagnostic.treatment}
                      </Text>
                    </View>
                  )}

                  {/* Footer actions */}
                  <View style={styles.cardActions}>
                    <View style={styles.continueHint}>
                      <Ionicons name="chatbubble-ellipses-outline" size={14} color={Colors.lime} />
                      <Text style={styles.continueHintText}>Toucher pour continuer la conversation</Text>
                    </View>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation?.();
                        confirmDelete(diagnostic);
                      }}
                      style={styles.deleteButton}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons name="trash-outline" size={18} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function getStatusBadge(status: string): { bg: string; text: string } {
  switch (status) {
    case 'traité':
      return { bg: Colors.lime15, text: Colors.lime };
    case 'en cours':
      return { bg: Colors.warning15, text: Colors.warning };
    case 'surveillance':
      return { bg: Colors.info15, text: Colors.info };
    default:
      return { bg: Colors.cream10, text: Colors.cream50 };
  }
}

function statusLabel(status: DiagnosticStatus): string {
  switch (status) {
    case 'en cours':
      return '🟡 En cours';
    case 'traité':
      return '🟢 Traité';
    case 'surveillance':
      return '🔵 Mettre en surveillance';
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
  scrollContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    padding: 20,
  },
  statCardLarge: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValueLarge: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.lime,
    marginTop: 12,
  },
  statLabelLarge: {
    fontSize: 16,
    color: Colors.creamLow,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCardSmall: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValueSmall: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.cream,
  },
  statLabelSmall: {
    fontSize: 12,
    color: Colors.creamLow,
    marginTop: 4,
    textAlign: 'center',
  },
  statusIndicator: {
    width: 24,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.card,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.lime,
    borderColor: Colors.lime,
  },
  filterText: {
    color: Colors.creamLow,
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: Colors.black,
  },
  diagnosticsList: {
    padding: 20,
    paddingTop: 0,
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
  diagnosticCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  diagnosticCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  diagnosticIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lime08,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  diagnosticCardInfo: {
    flex: 1,
  },
  diagnosticCulture: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.cream,
  },
  diagnosticDate: {
    fontSize: 12,
    color: Colors.creamLow,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.black,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  continueHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  continueHintText: {
    color: Colors.lime,
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.error12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error15,
  },
  diagnosticSymptoms: {
    fontSize: 14,
    color: Colors.creamLow,
    lineHeight: 20,
    marginBottom: 12,
  },
  diagnosisContainer: {
    backgroundColor: Colors.lime08,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  diagnosisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  diagnosisLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.lime,
    marginLeft: 6,
  },
  diagnosisText: {
    fontSize: 14,
    color: Colors.cream,
    lineHeight: 20,
  },
  probabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  probabilityBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.card,
    borderRadius: 3,
    overflow: 'hidden',
  },
  probabilityFill: {
    height: '100%',
    backgroundColor: Colors.lime,
  },
  probabilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.lime,
    minWidth: 40,
    textAlign: 'right',
  },
  treatmentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.info10,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  treatmentText: {
    flex: 1,
    fontSize: 14,
    color: Colors.info,
    lineHeight: 20,
  },
});
