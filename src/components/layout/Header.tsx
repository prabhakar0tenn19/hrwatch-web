'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '../common/Logo';
import { LogOut, Menu } from 'lucide-react';

interface StoredUser {
  username?: string;
  email?: string;
  role?: string;
}

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export function Header({ onToggleMobileMenu }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('hrwatch_user');
      if (raw) {
        setUser(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('hrwatch_token');
    localStorage.removeItem('hrwatch_user');
    router.push('/login');
  };

  const displayName = user?.username || 'Admin';
  const roleName = user?.role || 'SuperAdmin';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Menu Toggle & Brand Logo */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Logo />
      </div>

      {/* Right Controls: User Avatar & Logout */}
      <div className="flex items-center gap-3">
        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center shadow-2xs">
            {initials}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight">{displayName}</span>
            <span className="text-[10px] text-slate-400 capitalize">{roleName}</span>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="ml-2 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
