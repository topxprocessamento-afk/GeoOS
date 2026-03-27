import { Stack } from 'expo-router';

export default function TecnicoLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="ordens" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="perfil" />
    </Stack>
  );
}
