import type { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';

export type GithubRepositoryWithOrganisation = Awaited<
  ReturnType<RestEndpointMethods['apps']['listReposAccessibleToInstallation']>
>['data']['repositories'][number];

const fetchData = async ({ accessToken }: { accessToken: string }) => {
  const response = await fetch('/api/organisations', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return (await response.json()) as {
    message: string;
    repoList: GithubRepositoryWithOrganisation[];
  };
};

const useUserOrganisations = () => {
  const { data, status } = useSession();
  return useQuery(
    ['organisations'],
    () => fetchData({ accessToken: data?.accessToken }),
    { enabled: status === 'authenticated' && Boolean(data?.accessToken) }
  );
};

export default useUserOrganisations;
