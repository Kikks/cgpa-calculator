import { navLinks } from '@/lib/constants';
import { useContext, type FC } from 'react';
import SideNavLink from './sidenav-link';
import { LogOutIcon, X } from 'lucide-react';
import { Button } from '../ui/button';
import { UserContext } from '@/context/user';
import { Skeleton } from '../ui/skeleton';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideNav: FC<SideNavProps> = ({ isOpen, onClose }) => {
  const { logout, loading, user } = useContext(UserContext);

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed z-50 h-screen w-screen bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 z-50 flex h-full w-[300px] flex-col gap-5 overflow-y-auto overflow-x-hidden bg-white px-5 py-7  duration-300 lg:static 2xl:w-[20vw] 2xl:max-w-none ${
          isOpen
            ? 'left-0 translate-x-0 lg:left-0'
            : 'left-[-100%] translate-x-[-100%] lg:right-0 lg:translate-x-[0]'
        }`}
      >
        <div className="mb-5 flex w-full items-center justify-between pl-4">
          <h1 className="text-xl font-bold text-primary">CGPA Calculator</h1>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="text-2xl text-primary" />
          </Button>
        </div>

        <div className="w-full border-b">
          {loading ? (
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="mb-3 flex w-full items-center space-x-3"
                >
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="flex-1 rounded-md px-4 py-6" />
                </div>
              ))}
            </>
          ) : (
            navLinks.map((link, index) => (
              <SideNavLink key={index} {...link} onClick={() => onClose()} />
            ))
          )}
        </div>

        <div className="mt-auto grid w-full gap-3">
          {loading ? (
            <Skeleton className="w-full rounded-md px-4 py-6" />
          ) : !user ? (
            <>
              <Button variant="outline">Log In</Button>
              <Button>Sign Up Free</Button>
            </>
          ) : (
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2"
            >
              <LogOutIcon />
              Log Out
            </Button>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideNav;
