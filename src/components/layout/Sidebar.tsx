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
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Weekly Violators', href: '/', icon: AlertTriangle },
  { name: 'Attendance Calendar', href: '/calendar', icon: Calendar },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Exceptions', href: '/exceptions', icon: AlertCircle },
  { name: 'Policies', href: '/policies', icon: FileText },
  { name: 'Admin Tools', href: '/admin', icon: Sliders },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200 bg-[#FAF8F5] flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] p-3.5">
      {/* Navigation List */}
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

      {/* Bottom Fixed Section: Support */}
      <div className="pt-3 border-t border-slate-200/80">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Support & Helpdesk</span>
        </button>
      </div>
    </aside>
  );
}
