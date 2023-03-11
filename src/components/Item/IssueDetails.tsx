import useRepoIssues, { GithubIssue } from '@/hooks/useRepoIssues';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from '../Layout/Button';

type ItemDetailsProps = {
  issueNumber: string;
  organisationName: string;
  repoName: string;
};

const ItemDetails = ({
  issueNumber,
  organisationName,
  repoName,
}: ItemDetailsProps) => {
  const { data: issuesData } = useRepoIssues(
    organisationName.toString(),
    repoName.toString()
  );
  const router = useRouter();
  const [issue, setIssue] = useState<GithubIssue>();

  useEffect(() => {
    setIssue(
      // @ts-ignore
      issuesData?.data.find((issue) => issue.number.toString() === issueNumber)
    );
  }, [issueNumber, issuesData]);

  if (!issue) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="pb-12">
        <h1 className="mb-2 text-5xl font-extrabold dark:text-slate-200">
          #{issueNumber} {issue.title}{' '}
          <a
            href={issue.html_url}
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-90"
          >
            <ExternalLinkIcon width={42} height={42} className="inline" />
          </a>
        </h1>
        <h2 className="mb-2 text-xl font-semibold dark:text-slate-400">
          {organisationName}/{repoName}
        </h2>
        <span className="text-3xl font-bold dark:text-slate-200">
          {issue.bounty} SOL
        </span>
      </div>
      <div className="space-y-4 rounded-lg border-2 p-6 pt-4 dark:border-slate-700">
        <div>
          <h3 className="text-lg font-bold dark:text-slate-200">Description</h3>
          <p className="dark:text-slate-200">
            {issue.body || 'No description found'}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold dark:text-slate-200">Assignees</h3>
          {issue.assignees?.length &&
            issue.assignees.map((assignee) => (
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
            ))}
        </div>
        {/* <Button color="blue" className="rounded-lg">
          Distribute Bounty
        </Button> */}
      </div>
    </div>
  );
};

export default ItemDetails;
