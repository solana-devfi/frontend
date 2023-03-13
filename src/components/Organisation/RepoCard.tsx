import { GithubRepo } from '@/hooks/useOrganisationRepos';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
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
          <h3 className="text-lg font-bold underline">
            <Link
              href={`/organisations/${full_name}`}
              className="transition-colors dark:text-slate-300 dark:hover:text-slate-400"
            >
              {name}
            </Link>
          </h3>
          <a
            href={html_url}
            target="_blank"
            className="hover:underline dark:text-slate-400 dark:hover:text-slate-500"
            rel="noreferrer"
          >
            {html_url}
          </a>
        </div>
      </div>
      <div>
        <h3 className="text font-bold transition-colors dark:text-slate-300">
          Description
        </h3>
        <ReactMarkdown className="dark:text-slate-400">
          {description || 'No description found'}
        </ReactMarkdown>
      </div>
      <div>
        <h3 className="text font-bold transition-colors dark:text-slate-300">
          Latest Issues/PRs
        </h3>
        <LatestItems repoName={name} organisationName={login} />
      </div>
    </div>
  );
};

export default RepoCard;
