import { create } from 'zustand';
import * as Location from 'expo-location';

export interface GPSData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

export interface CameraOverlay {
  gps: GPSData | null;
  endereco: string;
  dataHora: string;
  numeroOS: string;
  tecnico: string;
}

interface CameraState {
  // State
  overlay: CameraOverlay;
  isLoadingGPS: boolean;
  gpsError: string | null;
  locationSubscription: Location.LocationSubscription | null;

  // Actions
  initializeGPS: () => Promise<void>;
  stopGPS: () => void;
  updateOverlay: (overlay: Partial<CameraOverlay>) => void;
  setGPSError: (error: string | null) => void;
}

export const useCameraStore = create<CameraState>((set, get) => ({
  // Initial state
  overlay: {
    gps: null,
    endereco: 'Localizando...',
    dataHora: new Date().toLocaleString('pt-BR'),
    numeroOS: '',
    tecnico: '',
  },
  isLoadingGPS: false,
  gpsError: null,
  locationSubscription: null,

  // Actions
  initializeGPS: async () => {
    set({ isLoadingGPS: true, gpsError: null });
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        set({ gpsError: 'Permissão de localização negada', isLoadingGPS: false });
        return;
      }

      // Get initial location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const gpsData: GPSData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
        altitude: location.coords.altitude || undefined,
        heading: location.coords.heading || undefined,
        speed: location.coords.speed || undefined,
      };

      // Get address from coordinates (reverse geocoding)
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude: gpsData.latitude,
          longitude: gpsData.longitude,
        });

        const endereco = addresses[0]
          ? `${addresses[0].street || ''}, ${addresses[0].city || ''}, ${addresses[0].region || ''}`
          : `${gpsData.latitude.toFixed(4)}, ${gpsData.longitude.toFixed(4)}`
          ;

        set((state) => ({
          overlay: {
            ...state.overlay,
            gps: gpsData,
            endereco: endereco.trim(),
          },
          isLoadingGPS: false,
        }));
      } catch (err) {
        console.error('[Camera] Reverse geocoding error:', err);
        set((state) => ({
          overlay: {
            ...state.overlay,
            gps: gpsData,
            endereco: `${gpsData.latitude.toFixed(4)}, ${gpsData.longitude.toFixed(4)}`,
          },
          isLoadingGPS: false,
        }));
      }

      // Subscribe to location updates
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // 5 seconds
          distanceInterval: 10, // 10 meters
        },
        (newLocation) => {
          const updatedGPS: GPSData = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            accuracy: newLocation.coords.accuracy || 0,
            altitude: newLocation.coords.altitude || undefined,
            heading: newLocation.coords.heading || undefined,
            speed: newLocation.coords.speed || undefined,
          };

          set((state) => ({
            overlay: {
              ...state.overlay,
              gps: updatedGPS,
            },
          }));
        }
      );

      set({ locationSubscription: subscription });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao obter localização';
      set({ gpsError: message, isLoadingGPS: false });
      console.error('[Camera] GPS error:', error);
    }
  },

  stopGPS: () => {
    const { locationSubscription } = get();
    if (locationSubscription) {
      locationSubscription.remove();
      set({ locationSubscription: null });
    }
  },

  updateOverlay: (overlay: Partial<CameraOverlay>) => {
    set((state) => ({
      overlay: {
        ...state.overlay,
        ...overlay,
      },
    }));
  },

  setGPSError: (error: string | null) => {
    set({ gpsError: error });
  },
}));
