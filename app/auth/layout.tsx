'use client';

import React from 'react';
import { AuthProvider } from '@/components/AuthProvider';
import Header from '@/components/Header';
import { useTaskStore } from '@/store/useTaskStore';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useTaskStore(state => state.user);

  if (user) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthLayout>{children}</AuthLayout>
    </AuthProvider>
  );
}
