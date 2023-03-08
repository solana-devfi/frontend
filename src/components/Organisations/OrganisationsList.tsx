import Link from 'next/link';

export const organisations = [
  {
    name: 'devfi',
    displayName: 'DevFi',
    totalAmount: 3.1002,
    address: 'FQ6tQRVERHA29n88WQeut1G3QfJ66bSMM733vFoqUXpr',
    repos: [
      {
        name: 'frontend',
        displayName: 'DevFi Frontend',
        totalAmount: 2.1,
      },
      {
        name: 'contracts',
        displayName: 'DevFi Smart Contracts',
        totalAmount: 1.0002,
      },
    ],
  },
  {
    name: 'devfi-2',
    displayName: 'DevFi #2',
    totalAmount: 3.1002,
    address: 'AGYboJMBit5PxpwBVTJ68L6itbsNXd3Yy3fzc6SkbeN1',
    repos: [
      {
        name: 'frontend',
        displayName: 'DevFi Frontend',
        totalAmount: 2.1,
      },
      {
        name: 'contracts',
        displayName: 'DevFi Smart Contracts',
        totalAmount: 1.0002,
      },
    ],
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
