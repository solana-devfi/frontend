import type { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import { Octokit } from '@octokit/rest';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export type GithubOrganisation = Awaited<
  ReturnType<RestEndpointMethods['orgs']['listForAuthenticatedUser']>
>['data'][number];

const useUserOrganisations = () => {
  const { data, status } = useSession();
  const [organisations, setOrganisations] = useState<GithubOrganisation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      setIsLoading(true);
      const octokit = new Octokit({
        auth: data.accessToken,
      });
      octokit.rest.orgs.listForAuthenticatedUser().then((res) => {
        setOrganisations(res.data);
        console.log('Orgs:', res.data);
        setIsLoading(false);
      });
    }
  }, [status, data]);

  return { organisations, isLoading };
};

export default useUserOrganisations;
