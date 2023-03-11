import useGetProxy from '@/hooks/useGetProxy';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useSession } from 'next-auth/react';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

interface ProxyButtonProps {}

const ProxyButton = ({}: ProxyButtonProps) => {
  const { data, status } = useSession();
  const { proxyAccount } = useGetProxy({
    githubName: data?.user?.name,
  });

  if (proxyAccount?.lamports === undefined) {
    return (
      <Button
        variant="outline"
        color="slate"
        className={twMerge(
          'rounded-lg text-base',
          status !== 'authenticated'
            ? 'cursor-not-allowed dark:hover:bg-transparent'
            : ''
        )}
        buttonProps={{
          disabled: status !== 'authenticated',
        }}
      >
        {'No bounties :('}
      </Button>
    );
  }

  return (
    <Button variant="outline" color="slate" className="rounded-lg text-base">
      Total Bounty: {proxyAccount?.lamports / LAMPORTS_PER_SOL} SOL
    </Button>
  );
};

export default ProxyButton;
