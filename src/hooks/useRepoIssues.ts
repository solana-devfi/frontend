import type { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import { Octokit } from '@octokit/rest';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';

export type GithubIssue = Awaited<
  ReturnType<RestEndpointMethods['issues']['listForRepo']>
>['data'][number] & { bounty?: string };

const fetchRepoIssues = (
  accessToken: string,
  organisationName: string,
  repoName: string
) => {
  const octokit = new Octokit({
    auth: accessToken,
  });
  return octokit.rest.issues
    .listForRepo({
      owner: organisationName,
      repo: repoName,
    })
    .then((issuesData) => {
      const regex = /Bounty (\d+(?:\.\d+)?)SOL/;
      return {
        ...issuesData,
        data: issuesData.data.map((item) => {
          const issueDescription = item.body;
          if (!issueDescription) {
            return item;
          }
          const match = issueDescription.match(regex);
          if (match) {
            return { ...item, bounty: match[1].toString() };
          }
          return item;
        }),
      };
    });
};

const useRepoIssues = (organisationName: string, repoName: string) => {
  const { data, status } = useSession();

  return useQuery(
    ['issues', organisationName, repoName],
    () => fetchRepoIssues(data?.accessToken, organisationName, repoName),
    { enabled: status === 'authenticated' }
  );
};

export default useRepoIssues;
