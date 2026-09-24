'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Client-side auth guard
    const token = localStorage.getItem('hrwatch_token');
    if (!token && pathname !== '/login') {
      router.push('/login');
    }
  }, [pathname, router]);

  // Avoid flash during SSR
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">{children}</main>;
  }

  return (
    <>
      <Header />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 px-8 py-6 max-w-[1240px] 2xl:max-w-[1360px] mx-auto w-full">
          {children}
        </main>
      </div>
    </>
  );
}
