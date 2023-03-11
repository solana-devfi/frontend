import useRepoIssues from '@/hooks/useRepoIssues';
import Image from 'next/image';
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

  const [issueData, setIssueData] = useState<any>(null);

  useEffect(() => {
    setIssueData(
      issuesData?.data.find((issue) => issue.number.toString() === issueNumber)
    );
  }, [issueNumber, issuesData]);

  if (!issueData) {
    return <div className="div">loading...</div>;
  }

  return (
    <div>
      <div className="pb-12">
        <h1 className="mb-2 text-5xl font-extrabold dark:text-slate-200">
          #{issueNumber} {issueData.title}
        </h1>
        <h2 className="mb-2 text-xl font-semibold dark:text-slate-400">
          {organisationName}/{repoName}
        </h2>
        <span className="text-3xl font-bold dark:text-slate-200">
          {issueData.bounty}
        </span>
      </div>
      <div className="space-y-4 rounded-lg border-2 p-6 pt-4 dark:border-slate-700">
        <div>
          <h3 className="text-lg font-bold dark:text-slate-200">Description</h3>
          <p className="dark:text-slate-200">
            Please add wallet authentication to our web app
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold dark:text-slate-200">
            Contributors
          </h3>
          <div className="flex items-center space-x-2 dark:text-slate-300">
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
              marcuspang
            </a>
            <span>1.0 SOL</span>
          </div>
        </div>
        {/* <Button color="blue" className="rounded-lg">
          Distribute Bounty
        </Button> */}
      </div>
    </div>
  );
};

export default ItemDetails;
