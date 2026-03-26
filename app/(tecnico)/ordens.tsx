import { View, Text } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

export default function OrdensScreen() {
  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-foreground">Ordens de Serviço</Text>
        <Text className="text-sm text-muted mt-2">Em desenvolvimento...</Text>
      </View>
    </ScreenContainer>
  );
}
