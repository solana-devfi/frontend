import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useQuery } from 'react-query';

const useWalletBalance = (publicKey: PublicKey) => {
  const { connection } = useConnection();

  return useQuery(['wallet', publicKey], () =>
    connection
      .getBalance(publicKey)
      .then((balance) => balance / LAMPORTS_PER_SOL)
  );
};

export default useWalletBalance;
