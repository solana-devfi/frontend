import type { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import { Octokit } from '@octokit/rest';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';

export type GithubIssue = Awaited<
  ReturnType<RestEndpointMethods['issues']['listForRepo']>
>['data'][number];

export const BOUNTY_REGEX = /Bounty (\d+(?:\.\d+)?)SOL/;

const fetchRepoIssues = (
  accessToken: string,
  organisationName: string,
  repoName: string
) => {
  const octokit = new Octokit({
    auth: accessToken,
  });
  return octokit.rest.issues.listForRepo({
    owner: organisationName,
    repo: repoName,
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
