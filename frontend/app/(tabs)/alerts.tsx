import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert as RNAlert,
} from 'react-native';
import { useAuthStore } from '../../src/store/authStore';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AlertsMap, MapAlert } from '../../src/components/AlertsMap';
import { Colors } from '../../src/constants/theme';

interface AlertItem {
  id: string;
  user_id: string;
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'critical' | string;
  read: boolean;
  latitude?: number | null;
  longitude?: number | null;
  location_name?: string | null;
  created_at: string;
}

const DEMO_ALERTS: Array<Omit<AlertItem, 'id' | 'user_id' | 'read' | 'created_at'>> = [
  {
    type: 'maladie',
    message: 'Mildiou détecté sur tomates - Parcelle Sud',
    severity: 'critical',
    latitude: 43.6047,
    longitude: 1.4442,
    location_name: 'Toulouse, Haute-Garonne',
  },
  {
    type: 'météo',
    message: 'Risque de gel cette nuit - Protégez les jeunes pousses',
    severity: 'warning',
    latitude: 45.7640,
    longitude: 4.8357,
    location_name: 'Lyon, Auvergne-Rhône-Alpes',
  },
  {
    type: 'recommandation',
    message: 'Période idéale pour la taille des oliviers',
    severity: 'info',
    latitude: 43.2965,
    longitude: 5.3698,
    location_name: 'Marseille, Bouches-du-Rhône',
  },
  {
    type: 'maladie',
    message: 'Pucerons signalés dans la région - Surveillez vos cultures',
    severity: 'warning',
    latitude: 48.5734,
    longitude: 7.7521,
    location_name: 'Strasbourg, Grand Est',
  },
  {
    type: 'météo',
    message: 'Forte chaleur prévue - Augmentez l\'irrigation',
    severity: 'warning',
    latitude: 44.8378,
    longitude: -0.5792,
    location_name: 'Bordeaux, Nouvelle-Aquitaine',
  },
];

export default function AlertsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [view, setView] = useState<'list' | 'map'>('list');
  const [seeding, setSeeding] = useState(false);

  const fetchAlerts = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const unreadParam = filter === 'unread' ? '?unread_only=true' : '';
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/alerts/${user.uid}${unreadParam}`
      );
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filter]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAlerts();
  };

  const markAsRead = async (alertId: string) => {
    try {
      await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/alerts/${alertId}/read?user_id=${user?.uid}`,
        { method: 'PATCH' }
      );
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, read: true } : a))
      );
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const seedDemoAlerts = async () => {
    if (!user) return;
    setSeeding(true);
    try {
      for (const demo of DEMO_ALERTS) {
        await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/alerts?user_id=${user.uid}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(demo),
          }
        );
      }
      await fetchAlerts();
    } catch (error) {
      console.error('Error seeding alerts:', error);
      RNAlert.alert('Erreur', 'Impossible de créer les alertes de démo');
    } finally {
      setSeeding(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'alert-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return Colors.error;
      case 'warning':
        return Colors.warning;
      default:
        return Colors.info;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maladie':
        return 'bug';
      case 'météo':
        return 'cloud';
      case 'recommandation':
        return 'bulb';
      default:
        return 'settings';
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={[Colors.forest, Colors.black]} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.lime} />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const unreadCount = alerts.filter((a) => !a.read).length;
  const mapAlerts: MapAlert[] = alerts.map((a) => ({
    id: a.id,
    message: a.message,
    severity: a.severity,
    type: a.type,
    latitude: a.latitude ?? undefined,
    longitude: a.longitude ?? undefined,
    location_name: a.location_name ?? undefined,
  }));

  return (
    <LinearGradient colors={[Colors.forest, Colors.black]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Alertes</Text>
            {unreadCount > 0 && (
              <Text style={styles.headerSubtitle}>{unreadCount} non lues</Text>
            )}
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={seedDemoAlerts}
              disabled={seeding}
              style={styles.seedButton}
              activeOpacity={0.8}
            >
              {seeding ? (
                <ActivityIndicator color={Colors.lime} size="small" />
              ) : (
                <Ionicons name="add-circle" size={28} color={Colors.lime} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* View toggle (List / Map) */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, view === 'list' && styles.toggleBtnActive]}
            onPress={() => setView('list')}
            activeOpacity={0.8}
          >
            <Ionicons name="list" size={18} color={view === 'list' ? Colors.black : Colors.creamLow} />
            <Text style={[styles.toggleText, view === 'list' && styles.toggleTextActive]}>
              Liste
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, view === 'map' && styles.toggleBtnActive]}
            onPress={() => setView('map')}
            activeOpacity={0.8}
          >
            <Ionicons name="map" size={18} color={view === 'map' ? Colors.black : Colors.creamLow} />
            <Text style={[styles.toggleText, view === 'map' && styles.toggleTextActive]}>
              Carte
            </Text>
          </TouchableOpacity>
        </View>

        {view === 'list' && (
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[styles.tab, filter === 'all' && styles.tabActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.tabText, filter === 'all' && styles.tabTextActive]}>
                Toutes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, filter === 'unread' && styles.tabActive]}
              onPress={() => setFilter('unread')}
            >
              <Text style={[styles.tabText, filter === 'unread' && styles.tabTextActive]}>
                Non lues {unreadCount > 0 && `(${unreadCount})`}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {view === 'map' ? (
          <View style={styles.mapContainer}>
            {alerts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="map-outline" size={64} color={Colors.cream50} />
                <Text style={styles.emptyText}>Aucune alerte à afficher sur la carte</Text>
                <TouchableOpacity
                  style={styles.demoButton}
                  onPress={seedDemoAlerts}
                  disabled={seeding}
                  activeOpacity={0.85}
                >
                  {seeding ? (
                    <ActivityIndicator color={Colors.black} />
                  ) : (
                    <>
                      <Ionicons name="sparkles" size={18} color={Colors.black} />
                      <Text style={styles.demoButtonText}>Générer des alertes de démo</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <AlertsMap alerts={mapAlerts} />
            )}
          </View>
        ) : (
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
            {alerts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="notifications-off-outline" size={64} color={Colors.cream50} />
                <Text style={styles.emptyText}>
                  {filter === 'unread' ? 'Aucune alerte non lue' : 'Aucune alerte'}
                </Text>
                {filter === 'all' && (
                  <TouchableOpacity
                    style={styles.demoButton}
                    onPress={seedDemoAlerts}
                    disabled={seeding}
                    activeOpacity={0.85}
                  >
                    {seeding ? (
                      <ActivityIndicator color={Colors.black} />
                    ) : (
                      <>
                        <Ionicons name="sparkles" size={18} color={Colors.black} />
                        <Text style={styles.demoButtonText}>Générer des alertes de démo</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              alerts.map((alert) => (
                <TouchableOpacity
                  key={alert.id}
                  style={[styles.alertCard, !alert.read && styles.alertCardUnread]}
                  onPress={() => !alert.read && markAsRead(alert.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.alertHeader}>
                    <View
                      style={[
                        styles.alertIconContainer,
                        { backgroundColor: `${getSeverityColor(alert.severity)}20` },
                      ]}
                    >
                      <Ionicons
                        name={getSeverityIcon(alert.severity)}
                        size={24}
                        color={getSeverityColor(alert.severity)}
                      />
                    </View>
                    <View style={styles.alertContent}>
                      <View style={styles.alertMeta}>
                        <View style={styles.alertTypeContainer}>
                          <Ionicons
                            name={getTypeIcon(alert.type)}
                            size={14}
                            color={Colors.lime}
                          />
                          <Text style={styles.alertType}>{alert.type}</Text>
                        </View>
                        <Text style={styles.alertDate}>
                          {format(new Date(alert.created_at), 'dd MMM HH:mm', { locale: fr })}
                        </Text>
                      </View>
                      <Text style={styles.alertMessage}>{alert.message}</Text>
                      {alert.location_name && (
                        <View style={styles.locationRow}>
                          <Ionicons name="location-outline" size={12} color={Colors.lime} />
                          <Text style={styles.locationText}>{alert.location_name}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  {!alert.read && <View style={styles.unreadIndicator} />}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
        <TouchableOpacity
          style={styles.footerLegal}
          onPress={() => router.push('/legal-notices')}
          activeOpacity={0.7}
        >
          <Ionicons name="shield-checkmark-outline" size={12} color={Colors.cream50} />
          <Text style={styles.footerLegalText}>Mentions legales</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.cream,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.lime,
    marginTop: 4,
  },
  seedButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewToggle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: Colors.lime,
  },
  toggleText: {
    color: Colors.creamLow,
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTextActive: { color: Colors.black },
  filterTabs: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.lime,
    borderColor: Colors.lime,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.creamLow,
  },
  tabTextActive: { color: Colors.black },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 32,
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    color: Colors.cream50,
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.lime,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  demoButtonText: {
    color: Colors.black,
    fontWeight: '700',
    fontSize: 14,
  },
  alertCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  alertCardUnread: {
    borderColor: Colors.lime,
    borderWidth: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: { flex: 1 },
  alertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertType: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.lime,
    textTransform: 'capitalize',
  },
  alertDate: {
    fontSize: 12,
    color: Colors.cream50,
  },
  alertMessage: {
    fontSize: 15,
    color: Colors.cream,
    lineHeight: 22,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  locationText: {
    fontSize: 12,
    color: Colors.lime,
    fontWeight: '500',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lime,
  },
  footerLegal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerLegalText: {
    fontSize: 11,
    color: Colors.cream50,
  },
});
