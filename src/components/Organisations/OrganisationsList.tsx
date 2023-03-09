import useUserOrganisations from '@/hooks/useUserOrganisations';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../Layout/Button';
import AddOrganisationLink from './AddOrganisationLink';

interface OrganisationsListProps {}

const OrganisationsList = ({}: OrganisationsListProps) => {
  const { status } = useSession();
  const { data } = useUserOrganisations();

  if (status !== 'authenticated') {
    return (
      <div>
        <Button
          color="blue"
          className="mt-4 rounded-lg"
          buttonProps={{
            onClick: () => signIn(),
          }}
        >
          Login to GitHub
        </Button>
      </div>
    );
  }
  return (
    <>
      <ul className="mt-8 space-y-4 pb-4">
        {data?.data.map((organisation) => (
          <li
            key={organisation.login}
            className="flex items-center justify-between rounded-md border-2 px-6 py-4 text-slate-200 dark:border-slate-200"
          >
            <div>
              <div className="mb-1 flex items-center space-x-2">
                <Image
                  src={organisation.avatar_url}
                  alt={organisation.login + ' avatar'}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <h3 className="text-2xl font-bold transition-colors hover:underline dark:text-slate-200 dark:hover:text-slate-300">
                  <Link href={'/organisations/' + organisation.login}>
                    {organisation.login}
                  </Link>
                </h3>
              </div>
              <p className="mb-1 dark:text-slate-400">
                {organisation.description || 'No description found'}
              </p>
              {/* TODO: fetch from smart contract */}
              <span className="font-mono dark:text-slate-400">
                FQ6tQRVERHA29n88WQeut1G3QfJ66bSMM733vFoqUXpr
              </span>
            </div>
            <div>
              {/* TODO: fetch from smart contract */}
              <span className="text-2xl font-bold">3 SOL</span>
            </div>
          </li>
        ))}
      </ul>
      <AddOrganisationLink />
    </>
  );
};

export default OrganisationsList;
