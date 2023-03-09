import { GithubRepo } from '@/hooks/useOrganisationRepos';
import Link from 'next/link';
import LatestItems from './LatestItems';

interface RepoCardProps extends GithubRepo {}

const RepoCard = ({
  name,
  full_name,
  description,
  html_url,
  owner: { login },
}: RepoCardProps) => {
  return (
    <div
      key={name}
      className="space-y-4 rounded-lg border-2 p-4 px-6 dark:border-slate-400"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold transition-colors hover:underline dark:text-slate-200 dark:hover:text-slate-300">
            <Link href={`/organisations/${full_name}`}>{name}</Link>
          </h3>
          <p className="dark:text-slate-400">
            <a href={html_url} className="hover:underline">
              {html_url}
            </a>
          </p>
        </div>
        <div>
          <span className="text-2xl font-bold dark:text-slate-200">
            1.1 SOL
          </span>
        </div>
      </div>
      <div>
        <h3 className="text font-bold transition-colors dark:text-slate-200">
          Description
        </h3>
        <p className="dark:text-slate-300">
          {description || 'No description found'}
        </p>
      </div>
      <div>
        <h3 className="text font-bold transition-colors dark:text-slate-200">
          Latest Issues/PRs
        </h3>
        <LatestItems repoName={name} organisationName={login} />
      </div>
    </div>
  );
};

export default RepoCard;
