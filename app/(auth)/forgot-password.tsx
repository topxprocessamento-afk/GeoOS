import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Email é obrigatório');
      return;
    }

    setIsLoading(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'geoos://reset-password',
      });

      if (err) throw err;

      setSuccess(true);
      setEmail('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao enviar link de recuperação';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center px-6 py-8">
          {/* Header */}
          <View className="mb-8 items-center">
            <Text className="text-3xl font-bold text-foreground mb-2">Recuperar Senha</Text>
            <Text className="text-sm text-muted text-center">
              Digite seu email para receber um link de recuperação
            </Text>
          </View>

          {/* Success Message */}
          {success && (
            <View className="mb-6 bg-success/10 border border-success rounded-lg p-4">
              <Text className="text-success text-sm font-medium">
                Link de recuperação enviado! Verifique seu email.
              </Text>
            </View>
          )}

          {/* Error Message */}
          {error && (
            <View className="mb-6 bg-error/10 border border-error rounded-lg p-4">
              <Text className="text-error text-sm font-medium">{error}</Text>
            </View>
          )}

          {/* Email Input */}
          <View className="mb-6">
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

          {/* Send Button */}
          <TouchableOpacity
            onPress={handleReset}
            disabled={isLoading}
            className={cn(
              'bg-primary rounded-lg py-3 items-center justify-center mb-4',
              isLoading && 'opacity-50'
            )}
          >
            {isLoading ? (
              <ActivityIndicator color="#ECEDEE" />
            ) : (
              <Text className="text-background font-semibold text-base">
                Enviar Link de Recuperação
              </Text>
            )}
          </TouchableOpacity>

          {/* Back to Login Link */}
          <Link href={"login" as any} asChild>
            <TouchableOpacity>
              <Text className="text-primary text-sm text-center font-medium">
                Voltar para login
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
