import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: keyof typeof Ionicons.glyphMap;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: Spacing.xxxxl }}>
      <Ionicons name={icon} size={64} color={Colors.cream50} />
      <Text
        style={{
          color: Colors.cream50,
          fontSize: Typography.body,
          fontWeight: Typography.semibold,
          marginTop: Spacing.lg,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            color: Colors.cream25,
            fontSize: Typography.bodySmall,
            marginTop: Spacing.sm,
            textAlign: 'center',
            paddingHorizontal: 32,
          }}
        >
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          style={{
            marginTop: Spacing.xl,
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.sm,
            backgroundColor: Colors.lime10,
            paddingHorizontal: Spacing.xl,
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.xl,
            borderWidth: 1,
            borderColor: Colors.lime15,
          }}
        >
          {actionIcon && <Ionicons name={actionIcon} size={18} color={Colors.lime} />}
          <Text
            style={{
              color: Colors.lime,
              fontSize: Typography.bodySmall,
              fontWeight: Typography.semibold,
            }}
          >
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
