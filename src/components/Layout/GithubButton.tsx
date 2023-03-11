import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from './Button';

export function GithubButton() {
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
          <Image
            src={'/logos/github.svg'}
            alt="Github Logo"
            width={24}
            height={24}
            className="mr-2 h-6 w-6"
          />
          Login
        </Button>
      );
    }
  }
  return (
    <Button
      color="slate"
      className="w-auto rounded-lg py-2 px-4 text-base"
      buttonProps={{
        onClick: () => signOut(),
      }}
    >
      <Image
        src={'/logos/github.svg'}
        alt="Github Logo"
        width={24}
        height={24}
        className="mr-2 h-6 w-6"
      />
      Logout
    </Button>
  );
}
