import GIT_TO_EARN_IDL from '@/data/idl';
import {
  createProviderWithConnection,
  getWalletFromSeed,
} from '@/utils/wallet';
import { Program } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';

export default function GetOrganisationAmount({
  login,
}: {
  login: string;
}): JSX.Element {
  const { wallet } = useWallet();
  const { connection } = useConnection();
  const provider = createProviderWithConnection(connection, wallet);
  const program = new Program(
    GIT_TO_EARN_IDL,
    process.env.PROGRAM_ID,
    provider
  );

  const walletAddress = getWalletFromSeed(login, program.programId);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (wallet) {
      connection
        .getBalance(walletAddress)
        .then((balance) => setBalance(balance / LAMPORTS_PER_SOL));
    }
  }, []);

  return <div>{balance || 0} SOL</div>;
}
