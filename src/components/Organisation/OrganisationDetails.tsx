import idl from '@/data/idl.json';
import useOrganisationRepos from '@/hooks/useOrganisationRepos';
import { GithubOrganisation } from '@/hooks/useUserOrganisations';
import {
  createProviderWithConnection,
  getProxyFromSeed,
  getWalletFromSeed,
} from '@/utils/wallet';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '../Layout/Button';
import DepositFundsPopup from './DepositFundsPopup';
import RepoCard from './RepoCard';

interface OrganisationDetailsProps extends GithubOrganisation {}

const OrganisationDetails = ({
  avatar_url,
  description,
  login,
  url,
}: OrganisationDetailsProps) => {
  const { publicKey, sendTransaction, wallet } = useWallet();
  // const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const provider = createProviderWithConnection(connection, wallet);
  const program = new Program(
    idl as any,
    '8KFc1kae5g8LqAwmZHskgaSYjaHXpt9PCRwKNtuajgAa',
    provider
  );
  const walletAddress = getWalletFromSeed(login, program.programId);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (wallet) {
      connection
        .getBalance(walletAddress)
        .then((balance) => balance)
        .then((balance) => balance / 1000000000)
        .then((balance) => setBalance(balance));
    }
  }, [wallet]);

  const [showPopup, setShowPopup] = useState<boolean>(false);

  const handleSubmit = (amount: number) => {
    transferSol(amount);
    setShowPopup(false);
  };

  // make form to put amt in
  function transferSol(amount) {
    try {
      const transaction = new anchor.web3.Transaction().add(
        anchor.web3.SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: walletAddress,
          lamports: amount * 1000000000,
        })
      );

      sendTransaction(transaction, connection, {
        maxRetries: 5,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const { data } = useOrganisationRepos(login);
  return (
    <div>
      <DepositFundsPopup />
      <div className="mb-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-row space-x-2">
            <Image
              src={avatar_url}
              alt={login + ' avatar'}
              width={64}
              height={64}
              className="rounded-full"
            />
            <h1 className="mb-2 text-5xl font-extrabold dark:text-slate-200">
              {login}
            </h1>
          </div>
          <Button
            className="rounded-lg py-2 px-4 text-base"
            buttonProps={{
              onClick: () => setShowPopup(true),
            }}
          >
            Deposit Funds
          </Button>
        </div>
        <a
          href={`https://github.com/${login}`}
          target="_blank"
          className="text-xl font-semibold hover:underline dark:text-slate-500 dark:hover:text-slate-600"
          rel="noreferrer"
        >
          {`https://github.com/${login}`}
        </a>
        <div className="my-2 -space-y-1">
          <h2 className="text-lg font-bold dark:text-slate-100">Description</h2>
          <p className="text-xl dark:text-slate-500">
            {description || 'No description found'}
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
        {data?.data.map((repo) => (
          <RepoCard key={repo.name} {...repo} />
        ))}
      </div>
    </div>
  );
};

export default OrganisationDetails;
