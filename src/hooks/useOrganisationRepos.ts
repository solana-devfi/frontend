import type { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import { Octokit } from '@octokit/rest';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

export type GithubRepo = Awaited<
  ReturnType<RestEndpointMethods['repos']['listForOrg']>
>['data'][number];

const fetchOrganisationRepos = (
  accessToken: string,
  organisationName: string
) => {
  const octokit = new Octokit({
    auth: accessToken,
  });

  return octokit.rest.repos.listForOrg({
    org: organisationName,
  });
};

const useOrganisationRepos = (organisationName: string) => {
  const { data, status } = useSession();

  return useQuery(
    ['repos', organisationName],
    () => fetchOrganisationRepos(data?.accessToken, organisationName),
    { enabled: Boolean(organisationName) && status === 'authenticated' }
  );
};

export default useOrganisationRepos;
