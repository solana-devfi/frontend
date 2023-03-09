import organisations from '@/data/organisations';
import useOrganisationRepos from '@/hooks/useOrganisationRepos';
import { GithubOrganisation } from '@/hooks/useUserOrganisations';
import Image from 'next/image';
import RepoCard from './RepoCard';

interface OrganisationDetailsProps extends GithubOrganisation {}

const OrganisationDetails = ({
  avatar_url,
  description,
  login,
  url,
}: OrganisationDetailsProps) => {
  const { repos } = useOrganisationRepos(login);
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center space-x-4">
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
        <a
          href={`https://github.com/${login}`}
          target="_blank"
          className="text-xl font-semibold hover:underline dark:text-slate-400 dark:hover:text-slate-500"
          rel="noreferrer"
        >
          {`https://github.com/${login}`}
        </a>
        <div className="my-2 -space-y-1">
          <h2 className="text-lg font-bold dark:text-slate-100">Wallet</h2>
          <p className="font-mono text-xl dark:text-slate-500">
            FQ6tQRVERHA29n88WQeut1G3QfJ66bSMM733vFoqUXpr
          </p>
        </div>
        <div className="my-2 -space-y-1">
          <h2 className="text-lg font-bold dark:text-slate-100">Funds</h2>
          <p className="text-xl font-bold dark:text-slate-500">1.1 SOL</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {repos.map((repo) => (
          <RepoCard key={repo.name} {...repo} />
        ))}
      </div>
    </div>
  );
};

export default OrganisationDetails;
