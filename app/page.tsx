'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useTaskStore } from '@/store/useTaskStore';

export default function HomePage() {
  const user = useTaskStore(state => state.user);
  const router = useRouter();

  useEffect(() => {
    router.replace(user ? '/note' : '/auth');
  }, [user, router]);

  return null;
}
