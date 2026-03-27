import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useCameraStore } from '@/store/cameraStore';

/**
 * Camera Overlay Component
 * Displays GPS, address, timestamp, OS number, and technician name
 * in the top-left corner with red text (as per PROMPT_MASTER_GeoOS)
 */
export function CameraOverlay() {
  const { overlay } = useCameraStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatGPS = () => {
    if (!overlay.gps) return 'GPS: Localizando...';
    return `GPS: ${overlay.gps.latitude.toFixed(4)}, ${overlay.gps.longitude.toFixed(4)}`;
  };

  const formatAccuracy = () => {
    if (!overlay.gps) return '';
    return `Precisão: ±${Math.round(overlay.gps.accuracy)}m`;
  };

  return (
    <View
      style={{
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        zIndex: 100,
      }}
    >
      {/* GPS Info */}
      <Text
        style={{
          color: '#EF4444', // Red color as per PROMPT_MASTER_GeoOS
          fontSize: 12,
          fontWeight: 'bold',
          fontFamily: 'monospace',
          marginBottom: 4,
        }}
      >
        {formatGPS()}
      </Text>

      {/* Accuracy */}
      {overlay.gps && (
        <Text
          style={{
            color: '#EF4444',
            fontSize: 11,
            fontWeight: '600',
            fontFamily: 'monospace',
            marginBottom: 4,
          }}
        >
          {formatAccuracy()}
        </Text>
      )}

      {/* Address */}
      <Text
        style={{
          color: '#EF4444',
          fontSize: 11,
          fontWeight: '600',
          fontFamily: 'monospace',
          marginBottom: 4,
        }}
      >
        Local: {overlay.endereco}
      </Text>

      {/* Timestamp */}
      <Text
        style={{
          color: '#EF4444',
          fontSize: 12,
          fontWeight: 'bold',
          fontFamily: 'monospace',
          marginBottom: 4,
        }}
      >
        {formatTime(currentTime)}
      </Text>

      {/* OS Number */}
      {overlay.numeroOS && (
        <Text
          style={{
            color: '#EF4444',
            fontSize: 11,
            fontWeight: '600',
            fontFamily: 'monospace',
            marginBottom: 4,
          }}
        >
          OS: {overlay.numeroOS}
        </Text>
      )}

      {/* Technician Name */}
      {overlay.tecnico && (
        <Text
          style={{
            color: '#EF4444',
            fontSize: 11,
            fontWeight: '600',
            fontFamily: 'monospace',
          }}
        >
          Técnico: {overlay.tecnico}
        </Text>
      )}
    </View>
  );
}
