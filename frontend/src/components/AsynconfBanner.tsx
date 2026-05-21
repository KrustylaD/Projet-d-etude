import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ASYNCONF_URL = 'https://app.itsasync.fr/conference';
const ASYNCONF_BLUE = '#3B82F6';

export function AsynconfBanner() {
  const handlePress = () => {
    Linking.openURL(ASYNCONF_URL);
  };

  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View style={styles.content}>
        <Ionicons name="ticket-outline" size={14} color="#FFFFFF" />
        <Text style={styles.brand}>Asynconf</Text>
        <Text style={styles.cta}>Reservez votre place</Text>
        <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: ASYNCONF_BLUE,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cta: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '500',
  },
});
