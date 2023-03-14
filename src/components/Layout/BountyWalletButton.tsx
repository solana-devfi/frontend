import useCreateProxy from '@/hooks/useCreateWallet';
import useGetBountyWallet from '@/hooks/useGetProxy';
import useWithdrawFromWallet from '@/hooks/useWithdrawFromWallet';
import { getWalletFromSeed } from '@/utils/wallet';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useSession } from 'next-auth/react';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

const ProxyButton = () => {
  const { data, status } = useSession();
  const { connected } = useWallet();
  const { proxyAccount, fetchProxyAccount } = useGetBountyWallet({
    githubName: data?.user?.name,
  });
  const { createProxy } = useCreateProxy({
    githubName: data?.user?.name,
    isOrg: false,
  });
  const { withdrawFromWallet } = useWithdrawFromWallet({ githubName: data?.user?.name });

  // if user is logged in with GitHub but no proxy account found
  if (proxyAccount === null && status === 'authenticated') {
    return (
      connected && (
        <Button
          variant="outline"
          color="slate"
          className={'rounded-lg text-base'}
          buttonProps={{
            onClick: () =>
              createProxy().then(() => fetchProxyAccount(data?.user?.name)),
          }}
        >
          Create bounty wallet
        </Button>
      )
    );
  }

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
    <Button
      variant="outline"
      color="slate"
      className="rounded-lg text-base"
      buttonProps={{ onClick: () => withdrawFromWallet() }}
    >
      Total Bounty: {proxyAccount?.lamports / LAMPORTS_PER_SOL} SOL
    </Button>
  );
};

export default ProxyButton;
