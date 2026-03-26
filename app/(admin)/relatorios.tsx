import { View, Text } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';

export default function Screen() {
  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-foreground">Em desenvolvimento...</Text>
      </View>
    </ScreenContainer>
  );
}
