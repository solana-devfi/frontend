import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface ContainerProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string;
}

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={twMerge('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  );
}
