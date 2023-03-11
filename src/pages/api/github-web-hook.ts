import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { NextApiRequest, NextApiResponse } from 'next';

const authConfig = {
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
  clientId: process.env.GITHUB_APP_CLIENT_ID,
  clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
};
const auth = createAppAuth(authConfig);

const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: authConfig,
});

// Create a new webhook on the GitHub repository
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { organisationName, repoName } = JSON.parse(req.body);
    if (!organisationName || !repoName) {
      return res.status(400).json({ message: 'Invalid owner / repo' });
    }
    let installationId: number;
    try {
      const { data } = await octokit.request('GET /orgs/{org}/installation', {
        org: organisationName,
      });
      installationId = data.id;
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        message: 'Fetch org failed',
      });
    }
    try {
      const installationAuth = await auth({
        type: 'installation',
        installationId,
      });
      const installationOctokit = new Octokit({
        auth: installationAuth.token, // directly pass the token
      });
      await installationOctokit.rest.repos.createWebhook({
        owner: organisationName,
        repo: repoName,
        name: 'web',
        active: true,
        events: ['pull_request'],
        config: {
          url: 'https://devfi-protocol.netlify.app/api/payload',
          content_type: 'json',
          insecure_ssl: '0',
        },
        mode: 'same-origin',
      });
      return res.status(200).json({
        message: `Webhook created successfully for ${organisationName}/${repoName}.`,
      });
    } catch (error) {
      if (error.status === 422) {
        return res.status(200).json({
          message: `Webhook already exists for ${organisationName}/${repoName}.`,
        });
      }
      console.error(error);
      return res.status(400).json({
        message: `Failed to create webhook for ${organisationName}/${repoName}:`,
      });
    }
  }
  return res.status(404).json({ message: 'Not found' });
}
