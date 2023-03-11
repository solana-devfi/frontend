import GIT_TO_EARN_IDL from '@/data/idl';
import { createProviderWithConnection, getProxyFromSeed } from '@/utils/wallet';
import { Program } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

const SIGNING_ORACLE_PUB_KEY = new PublicKey(
  process.env.SIGNING_ORACLE_ADDRESS
);

const createProxy = async ({
  publicKey,
  id,
  isOrg,
  recentBlockhash,
}: {
  publicKey: PublicKey;
  id: string;
  isOrg: boolean;
  recentBlockhash: string;
}) => {
  const res = await fetch('/api/create-proxy', {
    method: 'POST',
    body: JSON.stringify({
      publicKey,
      id,
      isOrg,
      recentBlockhash,
    }),
  });
  return await (res.json() as Promise<{
    message: string;
    signature: Buffer;
  }>);
};

const useCreateProxy = ({
  githubName,
  isOrg,
}: {
  githubName: string;
  isOrg: boolean;
}) => {
  const [recentBlockhash, setRecentBlockhash] = useState<string>();
  const { publicKey, sendTransaction, wallet } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (connection) {
      connection
        .getLatestBlockhash('finalized')
        .then((res) => setRecentBlockhash(res.blockhash));
    }
  }, [connection]);

  const { data: signature } = useQuery(
    ['create-proxy'],
    () =>
      createProxy({
        id: githubName,
        isOrg,
        publicKey,
        recentBlockhash,
      }),
    {
      enabled: Boolean(publicKey && recentBlockhash),
    }
  );

  useEffect(() => {
    if (signature && connection && wallet && publicKey && recentBlockhash) {
      const provider = createProviderWithConnection(connection, wallet);
      const program = new Program(
        GIT_TO_EARN_IDL,
        process.env.PROGRAM_ID,
        provider
      );
      const proxy = getProxyFromSeed(githubName, program.programId);

      const [state, _] = PublicKey.findProgramAddressSync(
        [Buffer.from('state')],
        program.programId
      );
      program.methods
        .initializeUserOwner(githubName, false)
        .accounts({
          walletProxy: proxy,
          state,
          signingOracle: SIGNING_ORACLE_PUB_KEY,
          signer: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .transaction()
        .then((transaction) => {
          transaction.recentBlockhash = recentBlockhash;
          transaction.feePayer = publicKey;

          transaction.addSignature(
            SIGNING_ORACLE_PUB_KEY,
            Buffer.from(signature.signature)
          );
          console.log(transaction);
          return sendTransaction(transaction, connection, { maxRetries: 5 });
        })
        .catch((e) => console.error(e));
    }
  }, [
    connection,
    signature,
    publicKey,
    recentBlockhash,
    sendTransaction,
    wallet,
    githubName,
  ]);

  return;
};

export default useCreateProxy;
