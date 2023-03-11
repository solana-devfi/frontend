import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import * as anchor from '@project-serum/anchor';
import { GitToEarn } from '@/data/idl';
import idl from '@/data/idl.json';
import { createProvider, getWalletFromSeed } from '@/utils/wallet';
import { NextApiRequest, NextApiResponse } from 'next';

const authConfig = {
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY,
  clientId: process.env.GITHUB_APP_CLIENT_ID,
  clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
};

const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: authConfig,
});

const signingOracle = anchor.web3.Keypair.fromSecretKey(
  JSON.parse(process.env.SIGNING_ORACLE_PRIVATE_KEY)
);
const provider = createProvider(new anchor.Wallet(signingOracle));
const program = new anchor.Program(
  idl as any as GitToEarn,
  process.env.PROGRAM_ID,
  provider
);
const [state, _] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from('state')],
  program.programId
);

// Handle incoming webhook events
export default async function payload(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
  try {
    const event = req.headers['x-github-event'];
    const payload = req.body;

    // Verify the webhook signature
    // const signature = req.headers['x-hub-signature'];
    // const secret = WEBHOOK_SECRET;
    // const hash = crypto
    //   .createHmac('sha1', secret)
    //   .update(JSON.stringify(payload))
    //   .digest('hex');
    // const signatureExpected = `sha1=${hash}`;
    // if (signature !== signatureExpected) {
    //   console.error('Invalid webhook signature.');
    //   return res.status(400).send('Invalid signature');
    // }

    // Handle the webhook event
    await handleWebhookEvent(event, payload);

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Failed to handle webhook event:', error);
  }
}

async function handleWebhookEvent(event: any, payload: any) {
  try {
    if (event === 'pull_request' && payload.action === 'closed') {
      const merged = payload.pull_request.merged;
      if (merged) {
        const owner = payload.repository.owner.login;
        const repo = payload.repository.name;

        let regex = /Fixes #(\d+)/;
        let match = payload.pull_request.body.match(regex);
        if (!match) {
          throw 'Linked Issue not found';
        }

        const issueNumber = match[1];
        const issueDescription = (
          await octokit.rest.issues.get({
            owner,
            repo,
            issue_number: issueNumber,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28',
            },
          })
        ).data.body;

        regex = /Bounty (\d+(?:\.\d+)?)SOL/;
        match = issueDescription.match(regex);
        if (!match) {
          throw 'Linked Bounty not found';
        }

        const bounty = match[1];

        const fromSeed = owner;
        const toSeed = payload.pull_request.user.login;

        await program.methods
          .transfer(
            owner,
            toSeed,
            new anchor.BN(bounty * anchor.web3.LAMPORTS_PER_SOL)
          )
          .accounts({
            senderWallet: getWalletFromSeed(fromSeed, program.programId),
            receiverWallet: getWalletFromSeed(toSeed, program.programId),
            state,
            signingOracle: signingOracle.publicKey,
            signer: program.provider.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([signingOracle])
          .rpc();
      }
    }
  } catch (error) {
    console.error('Failed to handle webhook event:', error);
  }
}
