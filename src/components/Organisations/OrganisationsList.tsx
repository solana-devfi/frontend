import GIT_TO_EARN_IDL from '@/data/idl';
import useUserOrganisations from '@/hooks/useUserOrganisations';
import {
  createProviderWithConnection,
  getWalletFromSeed,
} from '@/utils/wallet';
import { Program } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import AddOrganisationLink from './AddOrganisationLink';
import OrganisationBalance from './OrganisationBalance';

const OrganisationsList = () => {
  const { status } = useSession();
  const { wallet } = useWallet();
  const { connection } = useConnection();
  const provider = createProviderWithConnection(connection, wallet);
  const program = new Program(
    GIT_TO_EARN_IDL,
    process.env.PROGRAM_ID,
    provider
  );
  const { data } = useUserOrganisations();

  if (status !== 'authenticated') {
    return (
      <div className="mt-4 text-xl dark:text-slate-200">
        Please login to GitHub to see your organisations.
      </div>
    );
  }

  return data ? (
    <>
      <ul className="mt-8 space-y-4 pb-4">
        {data?.repoList
          // Remove repos with duplicate organisations
          .filter(
            (item, pos, self) =>
              self.findIndex(
                (repo) => repo.owner.login === item.owner.login
              ) === pos
          )
          .map((organisation) => (
            <li
              key={organisation.owner.login}
              className="flex items-center justify-between rounded-md border-2 px-6 py-4 text-slate-200 dark:border-slate-200"
            >
              <div>
                <div className="mb-1 flex items-center space-x-2">
                  <Image
                    src={organisation.owner.avatar_url}
                    alt={organisation.owner.login + ' avatar'}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <h3 className="text-2xl font-bold transition-colors hover:underline dark:text-slate-200 dark:hover:text-slate-300">
                    <Link href={'/organisations/' + organisation.owner.login}>
                      {organisation.owner.login}
                    </Link>
                  </h3>
                </div>
                <p className="mb-1 dark:text-slate-400">
                  {organisation.description || 'No description found'}
                </p>
                <span className="font-mono dark:text-slate-400">
                  {getWalletFromSeed(
                    organisation.owner.login,
                    program.programId
                  ).toBase58()}
                </span>
              </div>
              <div>
                <span className="text-2xl font-bold">
                  <OrganisationBalance
                    organisation={organisation.owner.login}
                  />
                </span>
              </div>
            </li>
          ))}
      </ul>
      <AddOrganisationLink />
    </>
  ) : (
    // make a loading skeleton
    <div className="mt-4 text-xl dark:text-slate-200">
      Loading organisations...
    </div>
  );
};

export default OrganisationsList;
