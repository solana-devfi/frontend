import { Popover, Transition } from '@headlessui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Fragment, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';
import { Container } from './Container';
import { Logo } from './Logo';

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

function MobileNavLink({ href, children }) {
  return (
    <Popover.Button as={Link} href={href} className="block w-full p-2">
      {children}
    </Popover.Button>
  );
}

function MobileNavIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={twMerge(
          'origin-center transition',
          open && 'scale-90 opacity-0'
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={twMerge(
          'origin-center transition',
          !open && 'scale-90 opacity-0'
        )}
      />
    </svg>
  );
}

function MobileNavigation() {
  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            <hr className="m-2 border-slate-300/40" />
            <WalletMultiButtonDynamic />
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

function GithubButton() {
  const { status } = useSession();
  if (status !== 'authenticated') {
    {
      return (
        <Button
          color="slate"
          className="rounded-lg py-2 px-4 text-base"
          buttonProps={{
            onClick: () => signIn(),
          }}
        >
          GitHub Login
        </Button>
      );
    }
  }
  return (
    <Button
      color="slate"
      className="rounded-lg py-2 px-4 text-base"
      buttonProps={{
        onClick: () => signOut(),
      }}
    >
      Github Logout
    </Button>
  );
}

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
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <GithubButton />
            <WalletMultiButtonDynamic className="!hidden !rounded-lg !py-2 !h-auto !text-base !transition-colors dark:!bg-blue-700 dark:hover:!bg-blue-900 md:!flex" />
            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
