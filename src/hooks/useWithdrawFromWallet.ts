import GIT_TO_EARN_IDL from '@/data/idl';
import {
  createProviderWithConnection,
  getProxyFromSeed,
  getWalletFromSeed,
} from '@/utils/wallet';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js';
import { useCallback } from 'react';

const useWithdrawFromWallet = ({ githubName }: { githubName: string }) => {
  const { publicKey, wallet, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const withdrawFromWallet = useCallback(async () => {
    if (connection && wallet) {
      const provider = createProviderWithConnection(connection, wallet);
      const program = new Program(
        GIT_TO_EARN_IDL,
        process.env.PROGRAM_ID,
        provider
      );
      const bountyProxy = getProxyFromSeed(githubName, program.programId);
      const bountyWallet = getWalletFromSeed(githubName, program.programId);

      const transaction = new anchor.web3.Transaction().add(
        await program.methods
          .withdraw(githubName, new anchor.BN(0.1 * LAMPORTS_PER_SOL))
          .accounts({
            userProxy: bountyProxy,
            userWallet: bountyWallet,
            authority: program.programId,
            systemProgram: SystemProgram.programId,
          })
          .transaction()
      );

      const res = await sendTransaction(transaction, connection, {
        maxRetries: 2,
      });

      console.log(res);
    }
  }, [connection, githubName, sendTransaction, wallet]);

  return { withdrawFromWallet };
};

export default useWithdrawFromWallet;
