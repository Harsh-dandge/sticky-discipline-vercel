'use client';

import React, { useEffect, useRef } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { carryForwardIncompleteTasks } from '@/services/firestore';

/**
 * Auto carry-forward scheduler: at 23:50 each day, moves pending tasks
 * from today to tomorrow. Runs once per day via a ref guard.
 */
const LifecycleComponent: React.FC = () => {
  const lastRunDateRef = useRef<string>('');

  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Auto carry-forward at 23:50
      if (hour === 23 && minute >= 50) {
        const user = useTaskStore.getState().user;
        if (!user) return;

        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        // Only run once per day
        if (lastRunDateRef.current === todayStr) return;
        lastRunDateRef.current = todayStr;

        // Compute tomorrow
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

        try {
          const count = await carryForwardIncompleteTasks(user.uid, todayStr, tomorrowStr);
          if (count > 0) {
            console.log(`🔄 Auto carry-forward: ${count} tasks moved to ${tomorrowStr}`);
          }
        } catch (err) {
          console.error('Carry-forward failed:', err);
        }
      }
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default LifecycleComponent;
