import { Repo } from '@/data/organisations';
import Link from 'next/link';
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
      <div className="pb-12">
        <h1 className="mb-2 text-5xl font-extrabold dark:text-slate-200">
          {displayName}
        </h1>
        <h2 className="mb-2 text-xl font-semibold dark:text-slate-400">
          {name}
        </h2>
        <span className="text-3xl font-bold dark:text-slate-200">
          {totalAmount} SOL
        </span>
      </div>
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
