'use client';

import { useState, useEffect, useContext } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';
import SideNav from '@/components/dashboard/sidenav';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserContext } from '@/context/user';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useContext(UserContext);
  const router = useRouter();
  const [sideNavIsOpen, setSideNavIsOpen] = useState(false);
  const largeScreenDown = useMediaQuery('(max-width: 1200px)');

  const toggleSideNav = () => {
    setSideNavIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    setSideNavIsOpen(false);
  }, [largeScreenDown]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading]);

  return (
    <div className="relative flex h-screen w-screen">
      <SideNav isOpen={sideNavIsOpen} onClose={toggleSideNav} />

      <main className="relative flex h-full w-full flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#f2f4f8] lg:p-5">
        {largeScreenDown && (
          <div className="sticky left-0 top-0 z-[100] flex w-full items-center justify-between gap-3 border-b border-black/10 bg-background px-5 py-3">
            <h1 className="text-xl font-bold text-primary">CGPA Calculator</h1>

            <Button variant="ghost" size="icon" onClick={toggleSideNav}>
              <Menu className="text-2xl text-primary" />
            </Button>
          </div>
        )}

        <div className="w-full flex-1 bg-white p-2 md:p-5 lg:bg-[#f2f4f8] lg:p-0">
          {children}
        </div>
      </main>
    </div>
  );
}
