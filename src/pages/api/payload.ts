import { Octokit } from '@octokit/rest';
import crypto from 'crypto';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN as string;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET as string;

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

// Handle incoming webhook events
export default async function payload(req: any, res: any): Promise<void> {
  try {
    const event = req.headers['x-github-event'];
    const signature = req.headers['x-hub-signature'];
    const payload = req.body;

    // Verify the webhook signature
    const secret = WEBHOOK_SECRET;
    const hash = crypto
      .createHmac('sha1', secret)
      .update(JSON.stringify(payload))
      .digest('hex');
    const signatureExpected = `sha1=${hash}`;
    if (signature !== signatureExpected) {
      console.error('Invalid webhook signature.');
      return res.status(400).send('Invalid signature');
    }

    // Handle the webhook event
    await handleWebhookEvent(event, payload);

    console.log('payload handled');
    console.log(event, payload);

    // Send a 200 OK response to GitHub
    res.status(200).send('OK');
  } catch (error) {
    console.error('Failed to handle webhook event:', error);
  }
}

async function handleWebhookEvent(event, payload) {
  try {
    if (
      event === 'pull_request' &&
      (payload.action === 'opened' || payload.action === 'synchronize')
    ) {
      const owner = payload.repository.owner.login;
      const repo = payload.repository.name;
      const pullRequestNumber = payload.pull_request.number;
      const status = await checkPullRequestStatus(
        owner,
        repo,
        pullRequestNumber
      );

      if (status) {
        console.log(
          `Pull request ${pullRequestNumber} in ${owner}/${repo} has been approved.`
        );
        // Add your code here to take action when the pull request is approved.
      } else {
        console.log(
          `Pull request ${pullRequestNumber} in ${owner}/${repo} has not been approved yet.`
        );
      }
    }
  } catch (error) {
    console.error('Failed to handle webhook event:', error);
  }
}

// Check if a pull request has been approved
async function checkPullRequestStatus(
  owner: string,
  repo: string,
  pullRequestNumber: number
): Promise<boolean> {
  try {
    const { data: reviews } = await octokit.pulls.listReviews({
      owner,
      repo,
      pull_number: pullRequestNumber,
    });
    return reviews.some((review) => review.state === 'APPROVED');
  } catch (error) {
    console.error('Failed to check pull request status:', error);
    return false;
  }
}
