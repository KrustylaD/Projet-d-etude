import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { AlertsMapProps, severityColor, computeCenter } from './types';

export type { MapAlert, AlertsMapProps } from './types';

export const AlertsMap: React.FC<AlertsMapProps> = ({ alerts, onMarkerPress }) => {
  const valid = alerts.filter(
    (a) => typeof a.latitude === 'number' && typeof a.longitude === 'number'
  );
  const center = computeCenter(alerts);

  return (
    <View style={styles.container}>
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: 6,
          longitudeDelta: 6,
        }}
      >
        {valid.map((a) => (
          <Marker
            key={a.id}
            coordinate={{ latitude: a.latitude!, longitude: a.longitude! }}
            title={a.type}
            description={a.message}
            pinColor={severityColor(a.severity)}
            onPress={() => onMarkerPress?.(a)}
          />
        ))}
      </MapView>
      <View style={styles.legend}>
        <Ionicons name="location" size={14} color="#4ade80" />
        <Text style={styles.legendText}>
          {valid.length} alerte{valid.length > 1 ? 's' : ''} géolocalisée{valid.length > 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );
};

export default AlertsMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1a0a',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1f3a1f',
  },
  legend: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(10, 26, 10, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1f3a1f',
  },
  legendText: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: '600',
  },
});
