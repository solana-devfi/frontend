import Link, { LinkProps } from 'next/link';
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

const baseStyles = {
  solid:
    'group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
  outline:
    'group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none',
};

const variantStyles = {
  solid: {
    slate:
      'bg-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:text-slate-800 dark:hover:bg-slate-300 dark:active:bg-slate-300 transition-colors text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900',
    blue: 'bg-blue-600 dark:bg-blue-800 text-white hover:text-slate-100 hover:bg-blue-500 dark:hover:bg-blue-700 active:bg-blue-800 dark:active:bg-blue-600 active:text-blue-100 focus-visible:outline-blue-600',
    white:
      'bg-white text-slate-900 hover:bg-blue-50 active:bg-blue-200 active:text-slate-600 focus-visible:outline-white',
  },
  outline: {
    slate:
      'ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300',
    white:
      'ring-slate-700 text-white hover:ring-slate-500 active:ring-slate-700 active:text-slate-400 focus-visible:outline-white',
    blue: '',
  },
};

interface ButtonProps {
  href?: string;
  variant?: keyof typeof variantStyles;
  color?: keyof (typeof variantStyles)[keyof typeof variantStyles];
  className?: string;
  buttonProps?: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
  linkProps?: LinkProps;
  children?: ReactNode;
}

export function Button({
  variant = 'solid',
  color = 'slate',
  href,
  className,
  children,
  buttonProps,
  linkProps,
}: ButtonProps) {
  className = twMerge(
    baseStyles[variant],
    variantStyles[variant][color],
    className
  );

  if (href) {
    return (
      <Link href={href} className={className} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} {...buttonProps}>
      {children}
    </button>
  );
}
