import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsReady(true);
      }
    };

    initAuth();
  }, [checkAuth]);

  if (!isReady) {
    return null; // Or a loading screen
  }

  return <>{children}</>;
};
