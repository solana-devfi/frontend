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
    <ul>
      {items
        .sort((a, b) => (a.updated_at < b.updated_at ? -1 : 1))
        .slice(0, 3)
        .map((item) => (
          <li
            key={item.id}
            className="flex font-light dark:text-slate-400"
          >
            <span className="w-12 font-normal">#{item.number}</span>
            <p>{item.title}</p>
          </li>
        ))}
    </ul>
  );
};

export default LatestItems;
