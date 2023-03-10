import { Octokit } from '@octokit/rest';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN as string;

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

// pages/api/example.js

// Create a new webhook on the GitHub repository
export default async function createWebhook(
  owner: string,
  repo: string,
  webhookUrl: string
) {
  try {
    await octokit.request('POST /repos/{owner}/{repo}/hooks', {
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
    });
    console.log('run');

    console.log(`Webhook created successfully for ${owner}/${repo}.`);
  } catch (error) {
    console.error(`Failed to create webhook for ${owner}/${repo}:`, error);
  }
}
