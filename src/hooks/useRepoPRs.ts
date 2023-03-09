import type { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import { Octokit } from '@octokit/rest';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';

export type GithubPullRequest = Awaited<
  ReturnType<RestEndpointMethods['pulls']['list']>
>['data'][number];

const fetchRepoPRs = (
  accessToken: string,
  organisationName: string,
  repoName: string
) => {
  const octokit = new Octokit({
    auth: accessToken,
  });
  return octokit.rest.pulls.list({
    owner: organisationName,
    repo: repoName,
  });
};

const useRepoPRs = (organisationName: string, repoName: string) => {
  const { data, status } = useSession();
  return useQuery(
    ['pull-requests', organisationName, repoName],
    () => fetchRepoPRs(data?.accessToken, organisationName, repoName),
    { enabled: status === 'authenticated' }
  );
};

export default useRepoPRs;
