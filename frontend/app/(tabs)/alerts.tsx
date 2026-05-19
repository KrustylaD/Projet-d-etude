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
import { useAuthStore } from '../../src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert as AlertType } from '../../src/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AlertsScreen() {
  const { user } = useAuthStore();
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchAlerts = async () => {
    if (!user) return;

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
      
      // Update local state
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, read: true } : alert
        )
      );
    } catch (error) {
      console.error('Error marking alert as read:', error);
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
        return '#ef4444';
      case 'warning':
        return '#fbbf24';
      default:
        return '#60a5fa';
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
      <LinearGradient colors={['#1a2f1a', '#0a1a0a', '#000000']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4ade80" />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <LinearGradient colors={['#1a2f1a', '#0a1a0a', '#000000']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Alertes</Text>
            {unreadCount > 0 && (
              <Text style={styles.headerSubtitle}>{unreadCount} non lues</Text>
            )}
          </View>
          <Ionicons name="notifications" size={28} color="#4ade80" />
        </View>

        {/* Filter Tabs */}
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
          {alerts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={64} color="#666" />
              <Text style={styles.emptyText}>
                {filter === 'unread' ? 'Aucune alerte non lue' : 'Aucune alerte'}
              </Text>
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
                          color="#4ade80"
                        />
                        <Text style={styles.alertType}>{alert.type}</Text>
                      </View>
                      <Text style={styles.alertDate}>
                        {format(new Date(alert.created_at), 'dd MMM HH:mm', { locale: fr })}
                      </Text>
                    </View>
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                  </View>
                </View>
                {!alert.read && <View style={styles.unreadIndicator} />}
              </TouchableOpacity>
            ))
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4ade80',
    marginTop: 4,
  },
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
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  tabActive: {
    backgroundColor: '#4ade80',
    borderColor: '#4ade80',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a3a3a3',
  },
  tabTextActive: {
    color: '#000',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 32,
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
    color: '#666',
    fontSize: 16,
    marginTop: 16,
  },
  alertCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  alertCardUnread: {
    borderColor: '#4ade80',
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
  alertContent: {
    flex: 1,
  },
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
    color: '#4ade80',
    textTransform: 'capitalize',
  },
  alertDate: {
    fontSize: 12,
    color: '#666',
  },
  alertMessage: {
    fontSize: 15,
    color: '#ffffff',
    lineHeight: 22,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },
});
