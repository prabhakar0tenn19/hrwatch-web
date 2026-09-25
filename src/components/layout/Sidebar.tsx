'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertTriangle,
  Calendar,
  Users,
  AlertCircle,
  FileText,
  Sliders,
  HelpCircle,
  X,
} from 'lucide-react';
import { Logo } from '../common/Logo';

const NAV_ITEMS = [
  { name: 'Weekly Violators', href: '/', icon: AlertTriangle },
  { name: 'Attendance Calendar', href: '/calendar', icon: Calendar },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Exceptions', href: '/exceptions', icon: AlertCircle },
  { name: 'Policies', href: '/policies', icon: FileText },
  { name: 'Admin Tools', href: '/admin', icon: Sliders },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const renderNavList = () => (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => onCloseMobile?.()}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              isActive
                ? 'bg-amber-400 text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive ? 'text-slate-900' : 'text-slate-500'
              }`}
            />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar (md and above) */}
      <aside className="hidden md:flex w-64 border-r border-slate-200 bg-[#FAF8F5] flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] p-3.5">
        {renderNavList()}

        <div className="pt-3 border-t border-slate-200/80">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Support & Helpdesk</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Responsive Drawer (< md) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Slide-out Menu Panel */}
          <div className="relative z-50 w-72 max-w-[85vw] bg-[#FAF8F5] shadow-2xl flex flex-col justify-between p-4 h-full border-r border-slate-200 animate-in slide-in-from-left duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 mb-3 border-b border-slate-200/80">
                <Logo />
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors focus:outline-none"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              {renderNavList()}
            </div>

            {/* Bottom Support Button */}
            <div className="pt-3 border-t border-slate-200/80">
              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Support & Helpdesk</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
