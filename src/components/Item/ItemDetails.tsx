import { Item } from '@/data/organisations';
import Link from 'next/link';
import Avatars from '../Repo/Avatars';

type ItemDetailsProps = Item & {
  organisationName: string;
  repoName: string;
};

const ItemDetails = ({
  amount,
  id,
  name,
  organisationName,
  repoName,
}: ItemDetailsProps) => {
  return (
    <div>
      <div className="pb-12">
        <h1 className="mb-2 text-5xl font-extrabold dark:text-slate-200">
          #{id} {name}
        </h1>
        <h2 className="mb-2 text-xl font-semibold dark:text-slate-400">
          {organisationName}/{repoName}
        </h2>
        <span className="text-3xl font-bold dark:text-slate-200">
          {amount} SOL
        </span>
      </div>
    </div>
  );
};

export default ItemDetails;
