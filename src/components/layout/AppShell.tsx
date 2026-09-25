'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Client-side auth guard
    const token = localStorage.getItem('hrwatch_token');
    if (!token && pathname !== '/login') {
      router.push('/login');
    }
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [pathname, router]);

  // Avoid flash during SSR
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]/40 flex flex-col">
      <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <div className="flex flex-1">
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 max-w-[1240px] 2xl:max-w-[1360px] mx-auto w-full min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
