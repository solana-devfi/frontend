import { GithubRepositoryWithOrganisation } from '@/hooks/useUserOrganisations';
import { App } from '@octokit/app';
import { NextApiRequest, NextApiResponse } from 'next';

const app = new App({
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
  oauth: {
    clientId: process.env.GITHUB_APP_CLIENT_ID,
    clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const repoList: GithubRepositoryWithOrganisation[] = [];

      const { data } = await app.octokit.request('/app');
      console.log('Authenticated as %s', data.name);
      for await (const { installation } of app.eachInstallation.iterator()) {
        for await (const { repository } of app.eachRepository.iterator({
          installationId: installation.id,
        })) {
          if (repository.archived) {
            continue;
          }

          // check if organisation is already in the repoList
          if (repoList.find((org) => org.owner.id === repository.owner.id)) {
            continue;
          }

          repoList.push(repository);
        }
      }

      return res.status(200).send({ message: 'Success', repoList });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
  }
  return res.status(404).send('Not found');
}
