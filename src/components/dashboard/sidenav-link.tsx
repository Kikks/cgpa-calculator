import { LucideIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';

interface SideNavLinkProps {
  foreign?: boolean;
  url: string;
  title: string;
  children?: {
    icon?: string;
    url: string;
    title: string;
  }[];
  actionButton?: {
    icon: string;
    url: string;
  };
  onClick?: () => void;
  Icon: LucideIcon;
}

const SideNavLink: FC<SideNavLinkProps> = ({
  foreign,
  title,
  url,
  onClick,
  actionButton,
  Icon,
}) => {
  const pathname = usePathname();
  const isActive =
    url === '/dashboard' ? pathname === url : pathname.startsWith(url);

  return (
    <div className="w-full">
      <div className="flex w-full items-center gap-2">
        <Link
          href={url}
          passHref
          target={foreign ? '_blank' : '_self'}
          className="w-full"
        >
          <div
            onClick={() => {
              if (onClick) onClick();
            }}
            className={`group flex flex-1 cursor-pointer items-center gap-2 rounded-md px-4 py-4 ${
              isActive ? 'bg-primary' : 'bg-transparent hover:bg-primary/10'
            }`}
          >
            <div className="flex flex-1 items-center space-x-3">
              <Icon
                fontSize={16}
                className={`${
                  isActive ? 'text-white' : ''
                } group-hover:!text-primary-main`}
              />
              <p
                className={`${
                  isActive ? 'text-white' : ''
                } group-hover:!text-primary-main`}
              >
                {title}
              </p>
            </div>
          </div>
        </Link>

        {actionButton && (
          <div className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/10">
            <Link href={actionButton?.url}>
              <PlusIcon className="text-2xl" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideNavLink;
