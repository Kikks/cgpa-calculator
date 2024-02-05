import type { Metadata } from 'next';

import { cn } from '@/lib/utils';

import './globals.css';
import Progressbar from '@/components/shared/progressbar';
import { toastOptions } from '@/lib/toaster';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from '@/context/user';
import { GradeProvider } from '@/context/grade';
import { fontSans } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'CGPA Calculator',
  description: 'Calculate your CGPA easily',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <UserProvider>
          <GradeProvider>
            <Progressbar />
            {children}
            <Toaster position="top-right" toastOptions={toastOptions} />
          </GradeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
