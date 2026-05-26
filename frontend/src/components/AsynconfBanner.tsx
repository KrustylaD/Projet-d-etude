import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ASYNCONF_URL = 'https://app.itsasync.fr/conference';
const ASYNCONF_BLUE = '#3B82F6';

let bannerDismissed = false;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach(fn => fn());
}

export function AsynconfBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (bannerDismissed) setVisible(false);
    listeners.add(sync);
    return () => { listeners.delete(sync); };
  }, []);

  function sync() {
    setVisible(false);
  }

  const handlePress = () => {
    Linking.openURL(ASYNCONF_URL);
  };

  const handleClose = () => {
    bannerDismissed = true;
    setVisible(false);
    notifyListeners();
  };

  if (!visible) return null;

  return (
    <View style={styles.banner}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <Ionicons name="ticket-outline" size={14} color="#FFFFFF" />
        <Text style={styles.brand}>Asynconf</Text>
        <Text style={styles.cta}>Reservez votre place</Text>
        <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.6}
      >
        <Ionicons name="close" size={16} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: ASYNCONF_BLUE,
    paddingVertical: 6,
    paddingLeft: 16,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  touchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
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
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
