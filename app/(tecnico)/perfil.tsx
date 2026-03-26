import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuthStore } from '@/store/authStore';

export default function PerfilScreen() {
  const router = useRouter();
  const { profile, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      (router.replace as any)('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="p-6 gap-6">
          {/* Header */}
          <Text className="text-2xl font-bold text-foreground">Meu Perfil</Text>

          {/* Profile Info */}
          <View className="bg-surface rounded-lg p-6 border border-border gap-4">
            <View>
              <Text className="text-xs font-semibold text-muted mb-1">Nome Completo</Text>
              <Text className="text-base font-semibold text-foreground">{profile?.nome_completo}</Text>
            </View>

            <View>
              <Text className="text-xs font-semibold text-muted mb-1">Matrícula</Text>
              <Text className="text-base font-semibold text-foreground">{profile?.matricula || 'N/A'}</Text>
            </View>

            <View>
              <Text className="text-xs font-semibold text-muted mb-1">Cargo</Text>
              <Text className="text-base font-semibold text-foreground capitalize">{profile?.cargo}</Text>
            </View>

            <View>
              <Text className="text-xs font-semibold text-muted mb-1">Telefone</Text>
              <Text className="text-base font-semibold text-foreground">{profile?.telefone || 'N/A'}</Text>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-error rounded-lg py-3 items-center justify-center mt-auto"
          >
            <Text className="text-background font-semibold">Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
