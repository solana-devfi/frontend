import useRepoIssues, { GithubIssue } from '@/hooks/useRepoIssues';
import useRepoPRs, { GithubPullRequest } from '@/hooks/useRepoPRs';
import { useEffect, useState } from 'react';

interface LatestItemsProps {
  repoName: string;
  organisationName: string;
}

const LatestItems = ({ repoName, organisationName }: LatestItemsProps) => {
  const { data: pullRequestsData, isLoading: isPullRequestsLoading } =
    useRepoPRs(organisationName, repoName);
  const { data: issuesData, isLoading: isIssuesLoading } = useRepoIssues(
    organisationName,
    repoName
  );
  const [items, setItems] = useState<(GithubIssue | GithubPullRequest)[]>([]);

  useEffect(() => {
    if (!isPullRequestsLoading && !isIssuesLoading) {
      if (pullRequestsData?.data && issuesData?.data) {
        setItems([...pullRequestsData.data, ...issuesData.data]);
      }
    }
  }, [isPullRequestsLoading, isIssuesLoading, pullRequestsData, issuesData]);

  return (
    <ul className="mt-2">
      {items
        .sort((a, b) => (a.updated_at < b.updated_at ? -1 : 1))
        .slice(0, 3)
        .map((item) => (
          <li
            key={item.id}
            className="flex justify-between font-light dark:text-slate-300"
          >
            <div>
              <span className="font-normal">#{item.number}</span>
              <span> {item.title}</span>
            </div>
            <div>{/* <span className="font-normal">1.1 SOL</span> */}</div>
          </li>
        ))}
    </ul>
  );
};

export default LatestItems;
