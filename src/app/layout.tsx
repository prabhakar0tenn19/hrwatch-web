import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HRWatch 2.0 | CG Infinity Workforce & Attendance Intelligence',
  description: 'Enterprise Office Attendance Compliance & Violator Monitoring System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased selection:bg-amber-100 selection:text-amber-900`}>
        <Header />
        <div className="flex min-h-[calc(100vh-4rem)]">
          <Sidebar />
          <main className="flex-1 px-8 py-6 max-w-[1240px] 2xl:max-w-[1360px] mx-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
