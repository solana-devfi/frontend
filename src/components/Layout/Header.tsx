import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect } from 'react';
import { Container } from './Container';
import { GithubButton } from './GithubButton';
import { Logo } from './Logo';
import { MobileNavigation } from './MobileNavigation';
import ProxyButton from './BountyWalletButton';

export const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export function Header() {
  useEffect(() => {
    // TODO: add light mode switch
    document.documentElement.classList.add('dark');
    // if (
    //   localStorage.getItem('color-theme') === 'dark' ||
    //   (!('color-theme' in localStorage) &&
    //     window.matchMedia('(prefers-color-scheme: dark)').matches)
    // ) {
    //   document.documentElement.classList.add('dark');
    // } else {
    //   document.documentElement.classList.remove('dark');
    // }
  }, []);

  return (
    <header className="py-8 dark:bg-slate-900">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="/" aria-label="Home">
              <Logo />
            </Link>
          </div>
          <div className="flex items-center gap-x-3 md:gap-x-4">
            <ProxyButton />
            <GithubButton />
            <WalletMultiButtonDynamic className="!hidden !h-auto !rounded-lg !py-2 !text-base !transition-colors dark:!bg-blue-700 dark:hover:!bg-blue-900 md:!flex" />
            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
