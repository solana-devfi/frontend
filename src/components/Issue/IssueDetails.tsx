import useRepoIssues, {
  BOUNTY_REGEX,
  GithubIssue,
} from '@/hooks/useRepoIssues';
import { GithubPullRequest } from '@/hooks/useRepoPRs';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

type IssueDetailsProps = {
  issueNumber: string;
  organisationName: string;
  repoName: string;
};

const IssueDetails = ({
  issueNumber,
  organisationName,
  repoName,
}: IssueDetailsProps) => {
  const { data: issuesData, isLoading } = useRepoIssues(
    organisationName.toString(),
    repoName.toString()
  );
  const [issue, setIssue] = useState<GithubIssue | GithubPullRequest>();

  useEffect(() => {
    setIssue(
      issuesData?.data.find((issue) => issue.number.toString() === issueNumber)
    );
  }, [issueNumber, issuesData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!issue) {
    return <div>Not found</div>;
  }

  const bounty =
    issue.body?.match(BOUNTY_REGEX)?.length > 1
      ? issue.body?.match(BOUNTY_REGEX)[1]
      : '';

  return (
    <div className='pb-8'>
      <div className="pb-8">
        <h1 className="mb-2 text-5xl font-extrabold dark:text-slate-200">
          #{issueNumber} {issue.title}{' '}
        </h1>
        <h2 className="mb-2 text-xl font-semibold dark:text-slate-400">
          <a
            href={issue.html_url}
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:underline hover:opacity-90"
          >
            {organisationName}/{repoName}/issues/{issue.number}
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
            {issue.body || 'No description found'}
          </ReactMarkdown>
        </div>
        <div>
          <h3 className="text-lg font-bold dark:text-slate-200">Assignees</h3>
          {issue.assignees?.length
            ? issue.assignees.map((assignee) => (
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

export default IssueDetails;
