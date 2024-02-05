import { LucideIcon } from 'lucide-react';
import React, { FC } from 'react';

interface DisplayCardProps {
  title?: string;
  subtitle?: string;
  value?: string | number | null;
  Icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

const DisplayCard: FC<DisplayCardProps> = ({
  title,
  subtitle,
  value,
  Icon,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer flex-col items-start justify-center space-y-3 self-stretch rounded-lg border border-input bg-background p-4 shadow-sm ${className ?? ''}`}
    >
      <div className="flex w-full items-center justify-between space-x-2">
        <div className="space-y-2">
          {title && (
            <p className="text-sm font-semibold uppercase text-foreground/50">
              {title}
            </p>
          )}

          {value && <p className="text-2xl font-bold">{value}</p>}
        </div>

        {Icon && (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Icon fontSize={40} className="text-primary" />
          </div>
        )}
      </div>
      {subtitle && (
        <p className="!mt-10 text-xs text-foreground/80">{subtitle}</p>
      )}
    </div>
  );
};

export default DisplayCard;
