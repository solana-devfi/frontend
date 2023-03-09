import type { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import { Octokit } from '@octokit/rest';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export type GithubRepo = Awaited<
  ReturnType<RestEndpointMethods['repos']['listForOrg']>
>['data'][number];

const useOrganisationRepos = (organisationName: string) => {
  const { data, status } = useSession();
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      setIsLoading(true);
      const octokit = new Octokit({
        auth: data.accessToken,
      });
      octokit.rest.repos
        .listForOrg({
          org: organisationName,
        })
        .then((res) => {
          setRepos(res.data);
          console.log('Repos:', res.data);
          setIsLoading(false);
        });
    }
  }, [status, data, organisationName]);

  return { repos: repos, isLoading };
};

export default useOrganisationRepos;
