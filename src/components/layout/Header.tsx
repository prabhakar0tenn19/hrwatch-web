'use client';

import React from 'react';
import { Logo } from '../common/Logo';
import { Bell, HelpCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Brand Logo */}
      <div className="flex items-center">
        <Logo />
      </div>

      {/* Right Controls: Notifications, Help, User Avatar */}
      <div className="flex items-center gap-3">
        <button
          title="Notifications"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors relative focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 bg-amber-500 rounded-full absolute top-2 right-2 border-2 border-white"></span>
        </button>

        <button
          title="Help & Support"
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center justify-center shadow-2xs">
            PL
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 leading-tight">Prabhakar Lal</span>
            <span className="text-[10px] text-slate-400">HR Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
