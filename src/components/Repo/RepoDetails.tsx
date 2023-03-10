import useOrganisationRepos from '@/hooks/useOrganisationRepos';
import useRepoIssues, { BOUNTY_REGEX } from '@/hooks/useRepoIssues';
import useRepoPRs from '@/hooks/useRepoPRs';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import Avatars from './Avatars';

interface RepoDetailsProps {
  repoName: string;
  organisationName: string;
}

const RepoDetails = ({ repoName, organisationName }: RepoDetailsProps) => {
  const { data: reposData } = useOrganisationRepos(organisationName);
  const { data: pullRequestsData } = useRepoPRs(
    organisationName.toString(),
    repoName.toString()
  );
  const { data: issuesData } = useRepoIssues(
    organisationName.toString(),
    repoName.toString()
  );

  const repo = reposData?.data.find((repo) => repo.name === repoName);
  if (!repo) {
    return (
      <div>
        <h1 className="mb-2 text-5xl font-extrabold dark:text-slate-200">
          No repo found
        </h1>
      </div>
    );
  }
  return (
    <div className="pb-12">
      <div className="flex justify-between">
        <div className="pb-8">
          <h1 className="mb-2 text-5xl font-extrabold dark:text-slate-200">
            {repo.name}
          </h1>
          <h2 className="mb-2 text-xl font-semibold dark:text-slate-400">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="transition-opacity hover:underline hover:opacity-90"
            >
              {repo.full_name}
            </a>
          </h2>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold dark:text-slate-200">
          Pull Requests
        </h3>
        <a
          className="group mb-6 inline-flex items-center justify-center rounded-lg bg-blue-600 py-2 px-4 text-lg font-semibold text-white hover:bg-blue-500 hover:text-slate-100 hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-800 active:text-blue-100 dark:bg-blue-800 dark:hover:bg-blue-700 dark:active:bg-blue-600"
          color="blue"
          href={`https://github.com/${organisationName}/${name}/compare`}
          target={'_blank'}
          rel="noreferrer"
        >
          <ExternalLinkIcon className="mr-2 flex h-6 w-6" /> Add PR
        </a>
      </div>
      <div className="relative overflow-x-auto rounded-lg dark:bg-slate-800">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="text-sm dark:text-slate-400">
              <th className="py-3 pl-4">NO.</th>
              <th className="py-3 pl-4">NAME</th>
              <th className="py-3 pl-4">CONTRIBUTORS</th>
              <th className="py-3 pl-4">UPDATED</th>
              <th className="py-3 pl-4">BOUNTY</th>
              <th className="py-3 pl-4">STATUS</th>
            </tr>
          </thead>
          <tbody className="dark:text-slate-200">
            {pullRequestsData?.data.length
              ? pullRequestsData.data.map((item) => {
                  const bounty =
                    item.body?.match(BOUNTY_REGEX)?.length > 1
                      ? item.body?.match(BOUNTY_REGEX)[1]
                      : '';
                  return (
                    <tr
                      key={item.id}
                      className="transition-colors dark:bg-slate-900/80 dark:hover:bg-slate-900/60"
                    >
                      <td className="py-4 pl-4">{item.number}</td>
                      <td className="py-4 pl-4">
                        <Link
                          href={`/organisations/${repo.full_name}/pulls/${item.number}`}
                          className="hover:underline"
                        >
                          {item.title}
                        </Link>
                      </td>
                      <td className="py-4 pl-4">
                        <Avatars assignees={item.assignees} />
                      </td>
                      <td className="py-4 pl-4">
                        <span>
                          {new Date(item.updated_at).toLocaleDateString()}{' '}
                          {new Date(item.updated_at).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="py-4 pl-4">
                        {' '}
                        {bounty ? (
                          <span className="font-bold dark:text-green-700">
                            {bounty}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-4 pl-4">{item.state}</td>
                    </tr>
                  );
                })
              : undefined}
          </tbody>
        </table>
      </div>
      <h3 className="mt-12 pb-6 text-2xl font-bold dark:text-slate-200">
        Issues
      </h3>
      <div className="relative overflow-x-auto rounded-lg dark:bg-slate-800">
        <table className="w-full table-fixed border-collapse text-left shadow">
          <thead>
            <tr className="text-sm dark:text-slate-400">
              <th className="py-3 pl-4">NO.</th>
              <th className="py-3 pl-4">NAME</th>
              <th className="py-3 pl-4">ASSIGNEES</th>
              <th className="py-3 pl-4">UPDATED</th>
              <th className="py-3 pl-4">BOUNTY</th>
              <th className="py-3 pl-4">STATUS</th>
            </tr>
          </thead>
          <tbody className="dark:text-slate-200">
            {issuesData?.data.length
              ? issuesData.data.map((item) => {
                  const bounty =
                    item.body?.match(BOUNTY_REGEX)?.length > 1
                      ? item.body?.match(BOUNTY_REGEX)[1]
                      : '';
                  return (
                    <tr
                      key={item.id}
                      className="transition-colors dark:bg-slate-900/80 dark:hover:bg-slate-900/60"
                    >
                      <td className="py-4 pl-4">{item.number}</td>
                      <td className="py-4 pl-4">
                        <Link
                          href={`/organisations/${repo.full_name}/issues/${item.number}`}
                          className="hover:underline"
                        >
                          {item.title}
                        </Link>
                      </td>
                      <td className="py-4 pl-4">
                        <Avatars assignees={item.assignees} />
                      </td>
                      <td className="py-4 pl-4">
                        <span>
                          {new Date(item.updated_at).toLocaleDateString()}{' '}
                          {new Date(item.updated_at).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="py-4 pl-4">
                        {bounty ? (
                          <span className="font-bold dark:text-green-700">
                            {bounty}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-4 pl-4">{item.state}</td>
                    </tr>
                  );
                })
              : undefined}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepoDetails;
