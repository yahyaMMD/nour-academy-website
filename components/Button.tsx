import { ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

type ButtonProps = {
  children: ReactNode;
  href: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
};

export function Button({
  children,
  href,
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-medium transition-all duration-200';
  
  const variantClasses = {
    primary: 'bg-dentalPurple text-white hover:bg-dentalPurple',
    secondary: 'bg-white text-dentalPurple hover:bg-gray-100',
    outline: 'border border-current text-white hover:bg-white/10',
  };

  return (
    <Link
      href={href}
      className={clsx(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}