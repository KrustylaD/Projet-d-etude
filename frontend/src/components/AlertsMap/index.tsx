// Web fallback (default). React Native picks up index.native.tsx on mobile automatically.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AlertsMapProps, severityColor, computeCenter } from './types';

export type { MapAlert, AlertsMapProps } from './types';

const GOOGLE_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export const AlertsMap: React.FC<AlertsMapProps> = ({ alerts }) => {
  const center = computeCenter(alerts);
  const valid = alerts.filter(
    (a) => typeof a.latitude === 'number' && typeof a.longitude === 'number'
  );

  const markersJs = valid
    .map(
      (a) => `{
        position: { lat: ${a.latitude}, lng: ${a.longitude} },
        title: ${JSON.stringify(a.message.slice(0, 100))},
        color: ${JSON.stringify(severityColor(a.severity))},
        info: ${JSON.stringify(
          `<div style="font-family:sans-serif;max-width:240px"><b style="color:${severityColor(
            a.severity
          )}">${a.type}</b><br/>${a.message.replace(/"/g, '&quot;')}${
            a.location_name ? `<br/><i>${a.location_name}</i>` : ''
          }</div>`
        )}
      }`
    )
    .join(',');

  const html = `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="initial-scale=1.0" />
<style>html,body,#map{height:100%;margin:0;padding:0;background:#0a1a0a;}</style>
</head><body>
<div id="map"></div>
<script>
  function initMap(){
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: ${center.latitude}, lng: ${center.longitude} },
      zoom: ${valid.length > 0 ? 6 : 5},
      styles: [
        {elementType:"geometry",stylers:[{color:"#1d2c1d"}]},
        {elementType:"labels.text.stroke",stylers:[{color:"#0a1a0a"}]},
        {elementType:"labels.text.fill",stylers:[{color:"#a3a3a3"}]},
        {featureType:"road",elementType:"geometry",stylers:[{color:"#2a3a2a"}]},
        {featureType:"water",elementType:"geometry",stylers:[{color:"#0a1a2a"}]},
        {featureType:"poi",elementType:"geometry",stylers:[{color:"#1a2f1a"}]},
        {featureType:"landscape",elementType:"geometry",stylers:[{color:"#0f1f0f"}]}
      ],
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });
    const markers = [${markersJs}];
    const infoWin = new google.maps.InfoWindow();
    markers.forEach(m => {
      const marker = new google.maps.Marker({
        position: m.position,
        map: map,
        title: m.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: m.color,
          fillOpacity: 0.9,
          strokeColor: '#0a1a0a',
          strokeWeight: 2
        }
      });
      marker.addListener('click', () => {
        infoWin.setContent(m.info);
        infoWin.open(map, marker);
      });
    });
  }
</script>
<script async defer src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&callback=initMap"></script>
</body></html>`;

  return (
    <View style={styles.container}>
      <View style={styles.webWrapper}>
        {React.createElement('iframe', {
          srcDoc: html,
          style: {
            width: '100%',
            height: '100%',
            border: 0,
            borderRadius: 12,
          },
          title: 'Carte des alertes',
        })}
      </View>
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
  webWrapper: { flex: 1, minHeight: 300 },
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
