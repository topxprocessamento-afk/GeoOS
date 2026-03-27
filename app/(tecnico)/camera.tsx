import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';

export default function CameraScreen() {
  const router = useRouter();

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-foreground text-center mb-2">
            📸 Câmera com Overlay
          </Text>
          <Text className="text-base text-muted text-center">
            Capture fotos com GPS, endereço, data/hora e informações da OS
          </Text>
        </View>

        {/* Features List */}
        <View className="bg-surface rounded-lg p-6 mb-8 w-full">
          <Text className="text-lg font-semibold text-foreground mb-4">Recursos:</Text>
          <Text className="text-sm text-muted mb-2">✓ GPS em tempo real (latitude, longitude, precisão)</Text>
          <Text className="text-sm text-muted mb-2">✓ Endereço automático (geocoding reverso)</Text>
          <Text className="text-sm text-muted mb-2">✓ Timestamp preciso (data e hora)</Text>
          <Text className="text-sm text-muted mb-2">✓ Número da OS e nome do técnico</Text>
          <Text className="text-sm text-muted">✓ Salva automaticamente no Supabase</Text>
        </View>

        {/* Open Camera Button */}
        <TouchableOpacity
          onPress={() => router.push('/(tecnico)/camera-full' as any)}
          className="bg-primary px-8 py-4 rounded-lg w-full items-center"
        >
          <Text className="text-background font-bold text-lg">Abrir Câmera</Text>
        </TouchableOpacity>

        {/* Info */}
        <View className="mt-8 bg-warning/10 border border-warning rounded-lg p-4 w-full">
          <Text className="text-xs text-warning font-semibold">⚠️ Permissões Necessárias</Text>
          <Text className="text-xs text-warning mt-2">
            O app precisa de permissão para acessar câmera e localização do seu dispositivo.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
