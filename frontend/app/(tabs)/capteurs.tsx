import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/theme';
import { AsynconfBanner } from '../../src/components/AsynconfBanner';

interface SensorReading {
  id: string;
  name: string;
  value: number;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  min: number;
  max: number;
  status: 'normal' | 'warning' | 'critical';
}

function generateSensorData(): SensorReading[] {
  const temp = Math.round((15 + Math.random() * 20) * 10) / 10;
  const humidity = Math.round((40 + Math.random() * 50) * 10) / 10;
  const soilMoisture = Math.round((20 + Math.random() * 60) * 10) / 10;
  const rainfall = Math.round(Math.random() * 25 * 10) / 10;
  const light = Math.round((400 + Math.random() * 800) * 10) / 10;
  const wind = Math.round((2 + Math.random() * 18) * 10) / 10;
  const leafWetness = Math.round((Math.random() * 100) * 10) / 10;

  return [
    {
      id: 'temp',
      name: 'Température',
      value: temp,
      unit: '°C',
      icon: 'thermometer-outline',
      color: temp > 30 ? Colors.warning : Colors.lime,
      min: -5,
      max: 45,
      status: temp > 35 ? 'critical' : temp > 30 ? 'warning' : 'normal',
    },
    {
      id: 'humidity',
      name: 'Humidité air',
      value: humidity,
      unit: '%',
      icon: 'water-outline',
      color: Colors.info,
      min: 10,
      max: 100,
      status: humidity < 30 ? 'warning' : humidity > 90 ? 'warning' : 'normal',
    },
    {
      id: 'soil',
      name: 'Humidité sol',
      value: soilMoisture,
      unit: '%',
      icon: 'earth-outline',
      color: soilMoisture < 25 ? Colors.warning : Colors.lime,
      min: 0,
      max: 100,
      status: soilMoisture < 20 ? 'critical' : soilMoisture < 30 ? 'warning' : 'normal',
    },
    {
      id: 'rain',
      name: 'Précipitations 24h',
      value: rainfall,
      unit: 'mm',
      icon: 'rainy-outline',
      color: Colors.info,
      min: 0,
      max: 50,
      status: rainfall > 30 ? 'critical' : 'normal',
    },
    {
      id: 'light',
      name: 'Luminosité',
      value: light,
      unit: 'lux',
      icon: 'sunny-outline',
      color: Colors.warning,
      min: 0,
      max: 2000,
      status: 'normal',
    },
    {
      id: 'wind',
      name: 'Vent',
      value: wind,
      unit: 'km/h',
      icon: 'speedometer-outline',
      color: wind > 15 ? Colors.warning : Colors.lime,
      min: 0,
      max: 30,
      status: wind > 25 ? 'critical' : wind > 15 ? 'warning' : 'normal',
    },
    {
      id: 'leaf',
      name: 'Humidité foliaire',
      value: leafWetness,
      unit: '%',
      icon: 'leaf-outline',
      color: leafWetness > 70 ? Colors.warning : Colors.lime,
      min: 0,
      max: 100,
      status: leafWetness > 80 ? 'critical' : leafWetness > 70 ? 'warning' : 'normal',
    },
  ];
}

function getStatusBadge(status: SensorReading['status']): { bg: string; text: string } {
  switch (status) {
    case 'critical':
      return { bg: Colors.error15, text: Colors.error };
    case 'warning':
      return { bg: Colors.warning15, text: Colors.warning };
    default:
      return { bg: Colors.success15, text: Colors.success };
  }
}

function getStatusLabel(status: SensorReading['status']): string {
  switch (status) {
    case 'critical':
      return 'Critique';
    case 'warning':
      return 'Attention';
    default:
      return 'Normal';
  }
}

function ProgressBar({ value, min, max, color }: { value: number; min: number; max: number; color: string }) {
  const pct = Math.min(Math.max(((value - min) / (max - min)) * 100, 5), 100);
  return (
    <View style={s.progressBarTrack}>
      <View style={[s.progressBarFill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

export default function CapteursScreen() {
  const [readings, setReadings] = useState<SensorReading[]>(() => generateSensorData());
  const [refreshing, setRefreshing] = useState(false);

  const refreshData = useCallback(() => {
    setRefreshing(true);
    setReadings(generateSensorData());
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const lastUpdate = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <LinearGradient colors={[Colors.forest, Colors.black]} style={s.container}>
      <SafeAreaView style={s.safeArea}>
        <View style={s.header}>
          <Text style={s.headerTitle}>Capteurs IoT</Text>
          <TouchableOpacity onPress={refreshData} style={s.refreshButton}>
            <Ionicons name="refresh" size={24} color={Colors.lime} />
          </TouchableOpacity>
        </View>

        <AsynconfBanner />

        <ScrollView
          contentContainerStyle={s.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshData} tintColor={Colors.lime} />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={s.section}>
            <Ionicons name="hardware-chip-outline" size={48} color={Colors.lime} />
            <Text style={s.sectionTitle}>Parcelle A3 — Capteurs actifs</Text>
            <Text style={s.lastUpdate}>
              Dernière mise à jour : {lastUpdate}
              {refreshing ? ' (rafraîchissement...)' : ''}
            </Text>
          </View>

          <View style={s.grid}>
            {readings.map((reading) => {
              const badge = getStatusBadge(reading.status);
              return (
                <View key={reading.id} style={s.sensorCard}>
                  <View style={s.sensorHeader}>
                    <View style={[s.iconCircle, { backgroundColor: reading.color + '15' }]}>
                      <Ionicons name={reading.icon} size={22} color={reading.color} />
                    </View>
                    <View style={[s.statusBadge, { backgroundColor: badge.bg }]}>
                      <Text style={[s.statusBadgeText, { color: badge.text }]}>
                        {getStatusLabel(reading.status)}
                      </Text>
                    </View>
                  </View>

                  <Text style={s.sensorName}>{reading.name}</Text>
                  <View style={s.sensorValueRow}>
                    <Text style={[s.sensorValue, { color: reading.color }]}>
                      {reading.value}
                    </Text>
                    <Text style={s.sensorUnit}>{reading.unit}</Text>
                  </View>

                  <ProgressBar value={reading.value} min={reading.min} max={reading.max} color={reading.color} />

                  <View style={s.rangeRow}>
                    <Text style={s.rangeText}>{reading.min}{reading.unit}</Text>
                    <Text style={s.rangeText}>{reading.max}{reading.unit}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={s.noteCard}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.info} />
            <Text style={s.noteText}>
              Données simulées pour démonstration. En production, ces valeurs proviendraient de
              capteurs IoT réels installés sur les parcelles.
            </Text>
          </View>

          <TouchableOpacity
            style={s.footerLegal}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <Ionicons name="shield-checkmark-outline" size={12} color={Colors.cream50} />
            <Text style={s.footerLegalText}>Mentions légales</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.card,
  },
  refreshButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.cream },
  scrollContent: { padding: 20, paddingBottom: 48 },
  section: { alignItems: 'center', marginBottom: 24, paddingTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.cream, marginTop: 12 },
  lastUpdate: { fontSize: 13, color: Colors.creamLow, marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  sensorCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 4,
  },
  sensorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: { fontSize: 11, fontWeight: '700' },
  sensorName: { fontSize: 14, color: Colors.creamLow, marginBottom: 6 },
  sensorValueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 10 },
  sensorValue: { fontSize: 32, fontWeight: 'bold' },
  sensorUnit: { fontSize: 14, color: Colors.cream50, paddingBottom: 6 },
  progressBarTrack: {
    height: 4,
    backgroundColor: Colors.cream08,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: { height: '100%', borderRadius: 2 },
  rangeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  rangeText: { fontSize: 11, color: Colors.cream50 },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginTop: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'flex-start',
  },
  noteText: { flex: 1, fontSize: 13, color: Colors.creamLow, lineHeight: 20 },
  footerLegal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerLegalText: {
    fontSize: 11,
    color: Colors.cream50,
  },
});
