import Link from 'next/link';
import { organisations } from '../../data/organisations';

interface OrganisationsListProps {}

const OrganisationsList = ({}: OrganisationsListProps) => {
  return (
    <ul className="mt-8 space-y-4">
      {organisations.map((organisation) => (
        <li
          key={organisation.name}
          className="flex items-center justify-between rounded-md border-2 px-4 py-2 text-slate-200 dark:border-slate-200"
        >
          <div>
            <h3 className="mb-1 text-xl font-bold underline transition-colors dark:text-blue-200 dark:hover:text-blue-400">
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
