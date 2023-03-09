import type { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import { Octokit } from '@octokit/rest';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';

export type GithubOrganisation = Awaited<
  ReturnType<RestEndpointMethods['orgs']['listForAuthenticatedUser']>
>['data'][number];

const fetchUserOrganisations = (accessToken: string) => {
  const octokit = new Octokit({
    auth: accessToken,
  });
  return octokit.rest.orgs.listForAuthenticatedUser();
};

const useUserOrganisations = () => {
  const { data, status } = useSession();
  return useQuery(
    ['organisations'],
    () => fetchUserOrganisations(data?.accessToken),
    { enabled: status === 'authenticated' }
  );
};

export default useUserOrganisations;
