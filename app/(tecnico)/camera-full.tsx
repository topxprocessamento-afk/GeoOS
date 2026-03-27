import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { CameraOverlay } from '@/components/camera-overlay';
import { useCameraStore } from '@/store/cameraStore';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system/legacy';
import { cn } from '@/lib/utils';
import { Link } from 'expo-router';

export default function CameraFullScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { initializeGPS, stopGPS, overlay, gpsError } = useCameraStore();
  const { profile } = useAuthStore();

  // Redirect to camera-full screen when component mounts
  useEffect(() => {
    router.replace('/(tecnico)/camera-full' as any);
  }, [router]);

  // Initialize GPS on mount
  useEffect(() => {
    initializeGPS();

    return () => {
      stopGPS();
    };
  }, [initializeGPS, stopGPS]);

  // Update overlay with technician name
  useEffect(() => {
    if (profile?.nome_completo) {
      useCameraStore.setState((state) => ({
        overlay: {
          ...state.overlay,
          tecnico: profile.nome_completo,
        },
      }));
    }
  }, [profile]);

  if (!permission) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text className="mt-4 text-foreground">Carregando permissões...</Text>
      </ScreenContainer>
    );
  }

  if (!permission.granted) {
    return (
      <ScreenContainer className="items-center justify-center px-6">
        <Text className="text-xl font-bold text-foreground mb-4">Permissão de Câmera</Text>
        <Text className="text-muted text-center mb-6">
          O GeoOS precisa de acesso à câmera para capturar fotos com overlay de GPS.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-primary px-8 py-3 rounded-lg"
        >
          <Text className="text-background font-semibold">Permitir Acesso</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  const handleTakePicture = async () => {
    if (!cameraRef.current || isCapturing || isUploading) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        exif: true,
        base64: false,
      });

      console.log('[Camera] Photo captured:', photo.uri);

      // Upload to Supabase
      await uploadPhotoToSupabase(photo.uri);
    } catch (error) {
      console.error('[Camera] Error taking picture:', error);
      Alert.alert('Erro', 'Falha ao capturar foto. Tente novamente.');
    } finally {
      setIsCapturing(false);
    }
  };

  const uploadPhotoToSupabase = async (photoUri: string) => {
    setIsUploading(true);
    try {
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(photoUri, {
        encoding: 'base64',
      });

      // Create unique filename
      const timestamp = new Date().getTime();
      const filename = `fotos/${profile?.id}/${timestamp}.jpg`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('registros_foto')
        .upload(filename, Buffer.from(base64, 'base64'), {
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('registros_foto')
        .getPublicUrl(filename);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('registros_foto')
        .insert({
          os_id: null, // Will be set when creating OS
          tecnico_id: profile?.id,
          foto_url: data.publicUrl,
          foto_original_url: data.publicUrl,
          latitude: overlay.gps?.latitude,
          longitude: overlay.gps?.longitude,
          altitude: overlay.gps?.altitude,
          precisao_gps: overlay.gps?.accuracy,
          endereco_foto: overlay.endereco,
          data_hora: new Date().toISOString(),
          observacao: `Foto capturada pelo técnico ${profile?.nome_completo}`,
        });

      if (dbError) {
        throw dbError;
      }

      Alert.alert('Sucesso', 'Foto capturada e salva com sucesso!');
      console.log('[Camera] Photo uploaded:', data.publicUrl);
    } catch (error) {
      console.error('[Camera] Upload error:', error);
      Alert.alert('Erro', 'Falha ao salvar foto. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScreenContainer className="bg-black" containerClassName="bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
        {/* Camera Overlay */}
        <CameraOverlay />

        {/* Controls */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            paddingBottom: 20,
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
        >
          {/* GPS Status */}
          {gpsError && (
            <Text style={{ color: '#EF4444', fontSize: 12, marginBottom: 12 }}>
              ⚠️ {gpsError}
            </Text>
          )}

          {/* Button Row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        disabled={isCapturing || isUploading || false}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 8,
                opacity: isCapturing || isUploading ? 0.5 : 1,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Voltar</Text>
            </TouchableOpacity>

            {/* Capture Button */}
            <TouchableOpacity
              onPress={handleTakePicture}
              disabled={isCapturing || isUploading}
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: '#0a7ea4',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: isCapturing || isUploading ? 0.5 : 1,
              }}
            >
              {isCapturing || isUploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: 'white',
                  }}
                />
              )}
            </TouchableOpacity>

            {/* Flip Camera Button */}
            <TouchableOpacity
              onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
              disabled={isCapturing || isUploading}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 8,
                opacity: isCapturing || isUploading ? 0.5 : 1,
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Virar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </ScreenContainer>
  );
}
