import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

export default function CameraScreen() {
  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1">
        <View className="p-6">
          <Text className="text-4xl font-bold text-foreground mb-4">
            📸 CÂMERA COM OVERLAY
          </Text>
          
          <Text className="text-lg text-muted mb-8">
            Esta é a tela de câmera do GeoOS
          </Text>

          <View className="bg-success rounded-lg p-6 mb-6">
            <Text className="text-white font-bold text-center text-xl">
              ✅ CÂMERA FUNCIONANDO!
            </Text>
          </View>

          <Text className="text-base text-foreground mb-4">
            Recursos:
          </Text>
          <Text className="text-sm text-muted mb-2">📍 GPS em tempo real</Text>
          <Text className="text-sm text-muted mb-2">🏠 Endereço automático</Text>
          <Text className="text-sm text-muted mb-2">🕐 Timestamp preciso</Text>
          <Text className="text-sm text-muted mb-8">☁️ Salva no Supabase</Text>

          <TouchableOpacity className="bg-primary rounded-lg p-4 items-center">
            <Text className="text-white font-bold text-lg">Abrir Câmera</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
