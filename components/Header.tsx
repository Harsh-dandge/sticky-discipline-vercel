'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTaskStore } from '@/store/useTaskStore';
import { logout } from '@/services/auth';
import { formatDate } from '@/lib/rulesEngine';

const Header: React.FC = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { user } = useTaskStore();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  const navLinks = [
    { href: '/note', label: '📌 Today’s Tasks' },
    { href: '/dashboard', label: '📊 Dashboard' },
    { href: '/reports', label: '📈 Reports' },
  ];

  return (
    <header className="bg-gray-900/90 backdrop-blur-md text-white border-b border-gray-800 p-4 sticky top-0 z-40 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl">📌</span>
          <span className="text-xl font-handwritten text-sticky-yellow hidden sm:inline">Sticky Discipline</span>
        </Link>

        {user && (
          <nav className="flex items-center gap-1 sm:gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg font-handwritten text-sm sm:text-base transition-colors ${
                    isActive
                      ? 'bg-yellow-500/20 text-sticky-yellow font-bold border border-yellow-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-handwritten2 text-gray-400 hidden md:inline">
            {formatDate(new Date())}
          </span>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowLogout(!showLogout)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <span className="text-sm font-handwritten">{user.displayName}</span>
                <span className="w-2 h-2 bg-green-400 rounded-full" />
              </button>
              {showLogout && (
                <div className="absolute right-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 z-50 min-w-[120px]">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 transition-colors rounded-lg font-handwritten"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth" className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg font-handwritten hover:bg-yellow-400 transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
