import { useEffect, useRef } from 'react';
import { View, Animated, StyleProp, ViewStyle } from 'react-native';
import { Colors, BorderRadius } from '../constants/theme';

type SkeletonVariant = 'card' | 'circle' | 'block' | 'card-small';

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  count?: number;
  style?: StyleProp<ViewStyle>;
}

const variantStyles: Record<SkeletonVariant, ViewStyle> = {
  card: {
    height: 100,
    borderRadius: BorderRadius.lg,
  },
  'card-small': {
    height: 72,
    borderRadius: BorderRadius.md,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
  },
  block: {
    height: 16,
    borderRadius: BorderRadius.sm,
  },
};

function SkeletonItem({ variant, style }: { variant: SkeletonVariant; style?: StyleProp<ViewStyle> }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [anim]);

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.cream06, Colors.cream10],
  });

  return (
    <Animated.View
      style={[
        variantStyles[variant],
        { backgroundColor },
        style,
      ]}
    />
  );
}

export default function SkeletonLoader({ variant = 'card', count = 1, style }: SkeletonLoaderProps) {
  return (
    <View style={[{ gap: 12 }, style]}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} variant={variant} />
      ))}
    </View>
  );
}
