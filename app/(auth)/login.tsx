import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleLogin = async () => {
    setLocalError('');

    if (!email.trim()) {
      setLocalError('Email é obrigatório');
      return;
    }

    if (!password.trim()) {
      setLocalError('Senha é obrigatória');
      return;
    }

    try {
      console.log('[Login Screen] Attempting login with email:', email);
      await login(email, password);
      console.log('[Login Screen] Login successful');
      // Navigation is handled by the root layout
    } catch (err) {
      console.error('[Login Screen] Login error:', err);
      const message = err instanceof Error ? err.message : 'Erro ao fazer login';
      console.log('[Login Screen] Error message:', message);
      setLocalError(message);
    }
  };

  const displayError = localError || error;

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center px-6 py-8">
          {/* Header */}
          <View className="mb-8 items-center">
            <Text className="text-4xl font-bold text-foreground mb-2">GeoOS</Text>
            <Text className="text-base text-muted text-center">
              Sistema de Ordens de Serviço para Topografia
            </Text>
          </View>

          {/* Error Message */}
          {displayError && (
            <View className="mb-6 bg-error/10 border border-error rounded-lg p-4">
              <Text className="text-error text-sm font-medium">{displayError}</Text>
            </View>
          )}

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Email</Text>
            <TextInput
              className={cn(
                'border rounded-lg px-4 py-3 text-foreground bg-surface',
                'border-border text-base'
              )}
              placeholder="seu.email@empresa.com"
              placeholderTextColor="#9BA1A6"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-foreground mb-2">Senha</Text>
            <TextInput
              className={cn(
                'border rounded-lg px-4 py-3 text-foreground bg-surface',
                'border-border text-base'
              )}
              placeholder="Sua senha"
              placeholderTextColor="#9BA1A6"
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={cn(
              'bg-primary rounded-lg py-3 items-center justify-center mb-4',
              isLoading && 'opacity-50'
            )}
          >
            {isLoading ? (
              <ActivityIndicator color="#ECEDEE" />
            ) : (
              <Text className="text-background font-semibold text-base">Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <Link href={"forgot-password" as any} asChild>
            <TouchableOpacity>
              <Text className="text-primary text-sm text-center font-medium">
                Esqueceu sua senha?
              </Text>
            </TouchableOpacity>
          </Link>

          {/* Footer */}
          <View className="mt-auto pt-8 border-t border-border">
            <Text className="text-xs text-muted text-center">
              Versão 1.0.0 • GeoOS © 2026
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
