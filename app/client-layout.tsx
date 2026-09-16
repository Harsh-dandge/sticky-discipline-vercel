'use client';

import React, { useEffect, useState } from 'react';
import { AuthProvider } from '@/components/AuthProvider';
import Header from '@/components/Header';
import { useTaskStore } from '@/store/useTaskStore';
import { getRulesEngineResult, formatDate } from '@/lib/rulesEngine';
import { registerServiceWorker } from '@/utils/swRegistration';
import LifecycleComponent from '@/components/LifecycleComponent';

function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const user = useTaskStore(state => state.user);
  const rules = getRulesEngineResult(formatDate(new Date()));
  const [mounted, setMounted] = useState(false);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    setMounted(true);
    setTimeString(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setTimeString(new Date().toLocaleTimeString());
    }, 1000);
    registerServiceWorker();
    return () => clearInterval(timer);
  }, []);

  return (
    <AuthProvider>
      {user && <Header />}
      <main>{children}</main>
      <LifecycleComponent />
      <div className="fixed bottom-2 right-2 text-xs text-gray-500 font-handwritten2 z-50 bg-gray-900/70 px-2 py-1 rounded backdrop-blur-sm border border-gray-800">
        {/* Render only after mount: the placeholder below is a static string, so
            server-rendered HTML and client hydration can never disagree about the
            mode or the clock. Once mounted, rules.mode + timeString are live. */}
        {mounted ? (
          <>{rules.mode} mode &bull; {timeString}</>
        ) : (
          <>mode &bull; &nbsp;</>
        )}
      </div>
    </AuthProvider>
  );
}

export default ClientLayoutWrapper;
