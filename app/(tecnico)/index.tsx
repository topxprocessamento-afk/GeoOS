import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuthStore } from '@/store/authStore';
import { useOSStore } from '@/store/osStore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Location from 'expo-location';

export default function TecnicoDashboard() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const { ordens, fetchOrdensDoTecnico, isLoading } = useOSStore();
  const [gpsStatus, setGpsStatus] = useState<'active' | 'inactive'>('inactive');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    if (profile?.id) {
      fetchOrdensDoTecnico(profile.id);
    }
  }, [profile?.id]);

  useEffect(() => {
    const checkGPS = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          setLocation(loc);
          setGpsStatus('active');
        } else {
          setGpsStatus('inactive');
        }
      } catch (error) {
        console.error('GPS error:', error);
        setGpsStatus('inactive');
      }
    };

    checkGPS();
  }, []);

  const osAtiva = ordens.find((os) => os.status === 'em_andamento');
  const osHoje = ordens.filter((os) => {
    const hoje = new Date().toDateString();
    const osData = new Date(os.created_at).toDateString();
    return osData === hoje;
  });

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="p-6 gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground">
              Olá, {profile?.nome_completo?.split(' ')[0]}
            </Text>
            <Text className="text-sm text-muted mt-1">Bem-vindo ao GeoOS</Text>
          </View>

          {/* GPS Status Card */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View
                  className={`w-3 h-3 rounded-full ${
                    gpsStatus === 'active' ? 'bg-success' : 'bg-muted'
                  }`}
                />
                <View>
                  <Text className="text-sm font-semibold text-foreground">GPS</Text>
                  <Text className="text-xs text-muted">
                    {gpsStatus === 'active' ? 'Ativo' : 'Inativo'}
                  </Text>
                </View>
              </View>
              {location && location.coords.accuracy && (
                <Text className="text-xs text-muted">
                  ±{Math.round(location.coords.accuracy)}m
                </Text>
              )}
            </View>
          </View>

          {/* OS Ativa Card */}
          {osAtiva && (
            <TouchableOpacity
              onPress={() => (router.push as any)(`ordens/${osAtiva.id}`)}
              className="bg-primary/10 rounded-lg p-4 border border-primary"
            >
              <Text className="text-xs font-semibold text-primary mb-2">OS ATIVA</Text>
              <Text className="text-lg font-bold text-foreground mb-1">{osAtiva.numero_os}</Text>
              <Text className="text-sm text-muted">{osAtiva.titulo}</Text>
            </TouchableOpacity>
          )}

          {/* Resumo Rápido */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">Resumo de Hoje</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
                <Text className="text-2xl font-bold text-primary">{osHoje.length}</Text>
                <Text className="text-xs text-muted mt-1">OSs Hoje</Text>
              </View>
              <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
                <Text className="text-2xl font-bold text-success">
                  {ordens.filter((os) => os.status === 'concluida').length}
                </Text>
                <Text className="text-xs text-muted mt-1">Concluídas</Text>
              </View>
            </View>
          </View>

          {/* OSs Pendentes */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-3">Próximas OSs</Text>
            {isLoading ? (
              <ActivityIndicator color="#0a7ea4" />
            ) : ordens.filter((os) => os.status === 'pendente').length > 0 ? (
              ordens
                .filter((os) => os.status === 'pendente')
                .slice(0, 3)
                .map((os) => (
                  <TouchableOpacity
                    key={os.id}
                    onPress={() => (router.push as any)(`ordens/${os.id}`)}
                    className="bg-surface rounded-lg p-4 border border-border mb-3"
                  >
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-foreground">
                          {os.numero_os}
                        </Text>
                        <Text className="text-xs text-muted mt-1">{os.titulo}</Text>
                      </View>
                      <View className="bg-warning/20 rounded px-2 py-1">
                        <Text className="text-xs font-semibold text-warning">Pendente</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
            ) : (
              <Text className="text-sm text-muted">Nenhuma OS pendente</Text>
            )}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={() => (router.push as any)('ordens')}
            className="bg-primary rounded-lg py-3 items-center justify-center mt-4"
          >
            <Text className="text-background font-semibold">Ver Todas as OSs</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
