import { View, Text, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useAuthStore } from '@/store/authStore';

export default function AdminDashboard() {
  const { profile } = useAuthStore();

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="p-6 gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground">
              Dashboard Admin
            </Text>
            <Text className="text-sm text-muted mt-1">
              Bem-vindo, {profile?.nome_completo?.split(' ')[0]}
            </Text>
          </View>

          {/* Resumo Cards */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Resumo em Tempo Real</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
                <Text className="text-2xl font-bold text-primary">0</Text>
                <Text className="text-xs text-muted mt-1">OSs Ativas</Text>
              </View>
              <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
                <Text className="text-2xl font-bold text-success">0</Text>
                <Text className="text-xs text-muted mt-1">Fotos Hoje</Text>
              </View>
            </View>
          </View>

          {/* Feed Placeholder */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-3">Feed de Atividades</Text>
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-sm text-muted text-center">
                Aguardando atividades em tempo real...
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
