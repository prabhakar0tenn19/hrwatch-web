import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

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
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
