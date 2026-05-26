import { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../constants/theme';

export interface DialogAction {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

interface AppDialogProps {
  visible: boolean;
  title: string;
  message: string;
  icon?: string;
  actions?: DialogAction[];
  onDismiss?: () => void;
}

export default function AppDialog({
  visible,
  title,
  message,
  icon,
  actions = [{ text: 'OK' }],
  onDismiss,
}: AppDialogProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 160,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.92);
    }
  }, [visible, fadeAnim, scaleAnim]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss?.());
  };

  const handleAction = (action: DialogAction) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      action.onPress?.();
      onDismiss?.();
    });
  };

  const getButtonStyle = (style?: string) => {
    switch (style) {
      case 'destructive':
        return { backgroundColor: Colors.error15, borderColor: Colors.error };
      case 'cancel':
        return { backgroundColor: Colors.card, borderColor: Colors.border };
      default:
        return { backgroundColor: Colors.lime12, borderColor: Colors.lime };
    }
  };

  const getButtonTextStyle = (style?: string) => {
    switch (style) {
      case 'destructive':
        return { color: Colors.error };
      case 'cancel':
        return { color: Colors.cream50 };
      default:
        return { color: Colors.lime };
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleDismiss}
    >
      <Pressable style={styles.overlay} onPress={handleDismiss}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Pressable onPress={() => {}}>
            {icon && (
              <View style={styles.iconWrap}>
                <Text style={styles.icon}>{icon}</Text>
              </View>
            )}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View
              style={[
                styles.actions,
                actions.length > 2 && styles.actionsColumn,
              ]}
            >
              {actions.map((action, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.button,
                    actions.length > 2 && styles.buttonColumn,
                    getButtonStyle(action.style),
                    actions.length <= 2 && i === 0 && actions.length > 1 && styles.buttonFirst,
                    actions.length <= 2 &&
                      i === actions.length - 1 &&
                      actions.length > 1 &&
                      styles.buttonLast,
                  ]}
                  onPress={() => handleAction(action)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      getButtonTextStyle(action.style),
                      action.style === 'cancel' && styles.buttonTextCancel,
                    ]}
                  >
                    {action.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 13, 7, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.forest,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.xl,
    shadowColor: Colors.lime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 16,
  },
  iconWrap: {
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.lime12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontFamily: Typography.display,
    fontWeight: Typography.bold,
    fontSize: Typography.h3,
    color: Colors.cream,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    fontFamily: Typography.bodyFamily,
    fontWeight: Typography.regular,
    fontSize: Typography.body,
    color: Colors.cream50,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionsColumn: {
    flexDirection: 'column',
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonColumn: {
    borderRadius: BorderRadius.md,
    flex: 0,
    paddingVertical: Spacing.md,
    width: '100%',
  },
  buttonFirst: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  buttonLast: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  buttonText: {
    fontFamily: Typography.bodyFamily,
    fontWeight: Typography.semibold,
    fontSize: Typography.bodySmall,
  },
  buttonTextCancel: {
    fontWeight: Typography.regular,
  },
});
