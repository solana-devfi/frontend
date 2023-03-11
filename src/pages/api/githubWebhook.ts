import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

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

/// Create a new webhook on the GitHub repository
export default async function createWebhook(owner: string, repo: string) {
  const {
    data: { id: installationId },
  } = await octokit
    .request('GET /orgs/{org}/installation', { org: owner })
    .catch((_) => null);
  const installationAuth = await auth({
    type: 'installation',
    installationId,
  });

  const installationOctokit = new Octokit({
    auth: installationAuth.token, // directly pass the token
  });

  try {
    await installationOctokit.rest.repos.createWebhook({
      owner: owner,
      repo: repo,
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
    console.log(`Webhook created successfully for ${owner}/${repo}.`);
  } catch (error) {
    if (error.status === 422) {
      console.log(`Webhook already exists for ${owner}/${repo}.`);
      return;
    } else {
      console.error(`Failed to create webhook for ${owner}/${repo}:`, error);
    }
  }
}
