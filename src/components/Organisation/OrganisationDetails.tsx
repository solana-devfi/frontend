import GIT_TO_EARN_IDL from '@/data/idl';
import {
  GithubRepositoryWithOrganisation
} from '@/hooks/useUserOrganisations';
import {
  createProviderWithConnection,
  getWalletFromSeed
} from '@/utils/wallet';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '../Layout/Button';
import DepositFundsPopup from './DepositFundsPopup';
import RepoCard from './RepoCard';

interface OrganisationDetailsProps {
  orgRepos: GithubRepositoryWithOrganisation[];
}

// Will only be rendered if orgRepos.length > 0
const OrganisationDetails = ({ orgRepos }: OrganisationDetailsProps) => {
  const { publicKey, sendTransaction, wallet } = useWallet();
  const { connection } = useConnection();
  const provider = createProviderWithConnection(connection, wallet);
  const program = new Program(
    GIT_TO_EARN_IDL,
    process.env.PROGRAM_ID,
    provider
  );
  const organisation = orgRepos[0].owner;

  const walletAddress = getWalletFromSeed(
    organisation.login,
    program.programId
  );
  const [balance, setBalance] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (wallet) {
      connection
        .getBalance(walletAddress)
        .then((balance) => setBalance(balance / LAMPORTS_PER_SOL));
    }
  }, []);


  const handleFormSubmit = async (amount: number) => {
    await transferSol(amount);
    setIsFormOpen(false);
  };

  // make form to put amt in
  const transferSol = async (amount: number) => {
    try {
      const transaction = new anchor.web3.Transaction().add(
        anchor.web3.SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: walletAddress,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      await sendTransaction(transaction, connection, {
        maxRetries: 5,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-row space-x-2">
            <Image
              src={organisation.avatar_url}
              alt={organisation.login + ' avatar'}
              width={64}
              height={64}
              className="rounded-full"
            />
            <h1 className="mb-2 text-5xl font-extrabold dark:text-slate-200">
              {organisation.login}
            </h1>
          </div>
          <Button
            className="rounded-lg py-2 px-4 text-base"
            buttonProps={{
              onClick: () => setIsFormOpen(true),
            }}
          >
            Deposit Funds
          </Button>
          <DepositFundsPopup
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
          />
        </div>
        <a
          href={`https://github.com/${organisation.login}`}
          target="_blank"
          className="text-xl font-semibold hover:underline dark:text-slate-500 dark:hover:text-slate-600"
          rel="noreferrer"
        >
          {`https://github.com/${organisation.login}`}
        </a>
        <div className="my-2 -space-y-1">
          <h2 className="text-lg font-bold dark:text-slate-100">Description</h2>
          <p className="text-xl dark:text-slate-500">
            {'No description found'}
          </p>
        </div>
        <div className="my-2 -space-y-1">
          <h2 className="text-lg font-bold dark:text-slate-100">Wallet</h2>
          <p className="font-mono text-xl dark:text-slate-500">
            {walletAddress.toString()}
          </p>
        </div>
        <div className="my-2 -space-y-1">
          <h2 className="text-lg font-bold dark:text-slate-100">Funds</h2>
          <p className="text-xl font-bold dark:text-slate-500">{balance} SOL</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {orgRepos.map((repo) => (
          <RepoCard key={repo.name} {...repo} />
        ))}
      </div>
    </div>
  );
};

export default OrganisationDetails;
