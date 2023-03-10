import { Octokit } from '@octokit/rest'
import { createAppAuth } from '@octokit/auth-app'

const GITHUB_APP_ID = parseInt(process.env.GITHUB_APP_ID);
const GITHUB_APP_PRIVATE_KEY = process.env.GITHUB_APP_PRIVATE_KEY as string;

// pages/api/example.js

// Create a new webhook on the GitHub repository
export default async function createWebhook(
  owner: string,
  repo: string,
  installationId: number,
  webhookUrl: string
) {
  const auth = createAppAuth({
    appId: GITHUB_APP_ID,
    privateKey: GITHUB_APP_PRIVATE_KEY,
  })

  const installationAuth = await auth({
    type: 'installation',
    installationId: 35082995,
  })

  const octokit = new Octokit({
    auth: installationAuth.token // directly pass the token
  })

  try {
    await octokit.rest.repos.createWebhook({
      owner: owner,
      repo: repo,
      name: 'web',
      active: true,
      events: ['push', 'pull_request', 'options'],
      config: {
        url: 'https://devfi-protocol.netlify.app/',
        content_type: 'json',
        insecure_ssl: '0',
      },
      mode: 'same-origin',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        'Access-Control-Allow-Origin': 'https://localhost:3000',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
    console.log(`Webhook created successfully for ${owner}/${repo}.`);
  } catch (error) {
    console.error(`Failed to create webhook for ${owner}/${repo}:`, error);
  }
}
