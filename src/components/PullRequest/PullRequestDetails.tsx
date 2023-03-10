import { BOUNTY_REGEX, GithubIssue } from '@/hooks/useRepoIssues';
import useRepoPRs, { GithubPullRequest } from '@/hooks/useRepoPRs';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

type PullRequestProps = {
  pullRequestNumber: string;
  organisationName: string;
  repoName: string;
};

const PullRequestDetails = ({
  pullRequestNumber,
  organisationName,
  repoName,
}: PullRequestProps) => {
  const { data: pullRequestsData, isLoading } = useRepoPRs(
    organisationName.toString(),
    repoName.toString()
  );
  const [pullRequest, setIssue] = useState<GithubIssue | GithubPullRequest>();

  useEffect(() => {
    setIssue(
      pullRequestsData?.data.find(
        (issue) => issue.number.toString() === pullRequestNumber
      )
    );
  }, [pullRequestNumber, pullRequestsData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!pullRequest) {
    return <div>Not found</div>;
  }

  const bounty =
    pullRequest.body?.match(BOUNTY_REGEX)?.length > 1
      ? pullRequest.body?.match(BOUNTY_REGEX)[1]
      : '';

  return (
    <div className="pb-8">
      <div className="pb-8">
        <h1 className="mb-2 text-5xl font-extrabold dark:text-slate-200">
          #{pullRequestNumber} {pullRequest.title}{' '}
        </h1>
        <h2 className="mb-2 text-xl font-semibold dark:text-slate-400">
          <a
            href={pullRequest.html_url}
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:underline hover:opacity-90"
          >
            {organisationName}/{repoName}/pulls/{pullRequest.number}
          </a>
        </h2>
        {Boolean(bounty) && (
          <span className="text-3xl font-bold dark:text-slate-200">
            {bounty} SOL
          </span>
        )}
      </div>
      <div className="space-y-4 rounded-lg border-2 p-6 pt-4 dark:border-slate-700">
        <div>
          <h3 className="text-lg font-bold dark:text-slate-200">Description</h3>
          <ReactMarkdown className="dark:text-slate-300">
            {pullRequest.body || 'No description found'}
          </ReactMarkdown>
        </div>
        <div>
          <h3 className="text-lg font-bold dark:text-slate-200">
            Contributors
          </h3>
          {pullRequest.assignees?.length
            ? pullRequest.assignees.map((assignee) => (
                <div
                  key={assignee.id}
                  className="flex items-center space-x-2 dark:text-slate-300"
                >
                  <Image
                    className="rounded-full border-2 border-white dark:border-gray-800"
                    src="https://avatars.githubusercontent.com/u/9083891?v=4"
                    width={36}
                    height={36}
                    alt=""
                  />
                  <a
                    href={'https://github.com/marcuspang'}
                    target="_blank"
                    className="hover:underline"
                    rel="noreferrer"
                  >
                    {assignee.name}
                  </a>
                  <span>1.0 SOL</span>
                </div>
              ))
            : undefined}
        </div>
        {/* <Button color="blue" className="rounded-lg">
          Distribute Bounty
        </Button> */}
      </div>
    </div>
  );
};

export default PullRequestDetails;
