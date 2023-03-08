import Link from 'next/link';

const organisations = [
  {
    name: 'devfi',
    displayName: 'DevFi',
    totalAmount: '3.1002',
  },
  {
    name: 'devfi-2',
    displayName: 'DevFi #2',
    totalAmount: '3.1002',
  },
];

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
            <h3 className="text-xl font-bold underline transition-colors dark:text-blue-200 dark:hover:text-blue-400">
              <Link href={'/organisations/' + organisation.name}>
                {organisation.displayName}
              </Link>
            </h3>
            <p className="dark:text-slate-300">{organisation.name}</p>
          </div>
          <div>
            <span className="font-mono text-xl">
              {organisation.totalAmount} SOL
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OrganisationsList;
