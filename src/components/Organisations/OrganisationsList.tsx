import organisations from '@/data/organisations';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '../Layout/Button';

interface OrganisationsListProps {}

const OrganisationsList = ({}: OrganisationsListProps) => {
  const { data, status } = useSession();
  console.log({ data });
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
    <ul className="mt-8 space-y-4">
      {organisations.map((organisation) => (
        <li
          key={organisation.name}
          className="flex items-center justify-between rounded-md border-2 px-6 py-4 text-slate-200 dark:border-slate-200"
        >
          <div>
            <h3 className="mb-1 text-2xl font-bold transition-colors hover:underline dark:text-slate-200 dark:hover:text-slate-300">
              <Link href={'/organisations/' + organisation.name}>
                {organisation.displayName}
              </Link>
            </h3>
            <p className="dark:text-slate-400">{organisation.name}</p>
            <span className="font-mono dark:text-slate-400">
              {organisation.address}
            </span>
          </div>
          <div>
            <span className="text-2xl font-bold">
              {organisation.totalAmount} SOL
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OrganisationsList;
