import { Repo } from '@/data/organisations';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { Button } from '../Button';
import Avatars from './Avatars';

interface RepoDetailsProps extends Repo {
  organisationName: string;
}

const RepoDetails = ({
  displayName,
  latestItems,
  name,
  totalAmount,
  organisationName,
}: RepoDetailsProps) => {
  return (
    <div>
      <div className="pb-8">
        <h1 className="mb-2 text-5xl font-extrabold dark:text-slate-200">
          {displayName}
        </h1>
        <h2 className="mb-2 text-xl font-semibold dark:text-slate-400">
          {organisationName}/{name}
        </h2>
        <span className="text-3xl font-bold dark:text-slate-200">
          {totalAmount} SOL
        </span>
      </div>
      <a
        className="group mb-6 inline-flex items-center justify-center rounded-lg bg-blue-600 py-2 px-4 text-lg font-semibold text-white hover:bg-blue-500 hover:text-slate-100 hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-800 active:text-blue-100 dark:bg-blue-800 dark:hover:bg-blue-700 dark:active:bg-blue-600"
        color="blue"
        href={`https://github.com/${organisationName}/${name}/compare`}
        target={'_blank'}
        rel="noreferrer"
      >
        <ExternalLinkIcon className="mr-2 flex h-6 w-6" /> Add PR
      </a>
      <div className="relative overflow-x-auto rounded-lg border dark:border-slate-400 dark:bg-slate-800">
        <table className="w-full table-auto border-collapse text-left">
          <thead>
            <tr className="text-sm dark:text-slate-400">
              <th className="py-3 pl-4">ID</th>
              <th className="py-3 pl-4">NAME</th>
              <th className="py-3 pl-4">CONTRIBUTORS</th>
              <th className="py-3 pl-4">BOUNTY</th>
              <th className="py-3 pl-4">APPROVED</th>
            </tr>
          </thead>
          <tbody className="dark:text-slate-200">
            {latestItems.map((item) => (
              <tr
                key={item.id}
                className="transition-colors dark:bg-slate-900 dark:hover:bg-slate-900/70"
              >
                <td className="py-4 pl-4">{item.id}</td>
                <td className="py-4 pl-4">
                  <Link
                    href={`/organisations/${organisationName}/${name}/${item.id}`}
                    className="hover:underline"
                  >
                    {item.name}
                  </Link>
                </td>
                <td className="py-4 pl-4">
                  <Avatars />
                </td>
                <td className="py-4 pl-4">{item.amount} SOL</td>
                <td className="py-4 pl-4">✅</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepoDetails;
