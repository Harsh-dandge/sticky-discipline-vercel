'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types/task';
import { onAuthStateChanged } from '@/services/auth';
import { useTaskStore } from '@/store/useTaskStore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser } = useTaskStore();
  const [loading, setLoading] = useState(true);
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
      setUserState(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
