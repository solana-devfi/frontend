import GIT_TO_EARN_IDL from '@/data/idl';
import {
  createProviderWithConnection,
  getProxyFromSeed,
  getWalletFromSeed,
} from '@/utils/wallet';
import { Program } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AccountInfo } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';

const useGetProxy = ({ githubName }: { githubName: string }) => {
  const { connection } = useConnection();
  const { wallet } = useWallet();
  const [proxyAccount, setProxyAccount] = useState<AccountInfo<Buffer>>();

  const fetchProxyAccount = useCallback(
    async (name?: string) => {
      if (connection && wallet && (name || githubName)) {
        const provider = createProviderWithConnection(connection, wallet);
        const program = new Program(
          GIT_TO_EARN_IDL,
          process.env.PROGRAM_ID,
          provider
        );
        const proxy = getWalletFromSeed(name || githubName, program.programId);
        const accountInfo = await connection.getAccountInfo(proxy);
        setProxyAccount(accountInfo);
      }
    },
    [connection, githubName, wallet]
  );

  useEffect(() => {
    fetchProxyAccount();
  }, [fetchProxyAccount]);

  return { proxyAccount, fetchProxyAccount };
};

export default useGetProxy;
