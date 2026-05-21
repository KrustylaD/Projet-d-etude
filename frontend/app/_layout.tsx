import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/signup" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="edit-profile" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="change-password" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="legal-notices" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="help-support" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
