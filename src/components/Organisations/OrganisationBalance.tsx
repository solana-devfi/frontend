import GIT_TO_EARN_IDL from '@/data/idl';
import useWalletBalance from '@/hooks/useWalletBalance';
import {
  createProviderWithConnection,
  getWalletFromSeed,
} from '@/utils/wallet';
import { Program } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

interface OrganisationBalanceProps {
  organisation: string;
}

export default function OrganisationBalance({
  organisation,
}: OrganisationBalanceProps) {
  const { wallet } = useWallet();
  const { connection } = useConnection();
  const provider = createProviderWithConnection(connection, wallet);
  const program = new Program(
    GIT_TO_EARN_IDL,
    process.env.PROGRAM_ID,
    provider
  );
  const walletAddress = getWalletFromSeed(organisation, program.programId);

  const { data: balance, isLoading } = useWalletBalance(walletAddress);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{balance || 0} SOL</div>;
}
