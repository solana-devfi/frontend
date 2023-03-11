import { NextApiRequest, NextApiResponse } from 'next';
import { App } from '@octokit/app';
import { request } from '@octokit/request';
import { getSession } from 'next-auth/react';

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
  try {
    const repoList = [];

    const { data } = await app.octokit.request('/app');
    console.log('authenticated as %s', data.name);
    for await (const { installation } of app.eachInstallation.iterator()) {
      for await (const { octokit, repository } of app.eachRepository.iterator({
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

    res.status(200).send(repoList);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}
