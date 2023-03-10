import GIT_TO_EARN_IDL from '@/data/idl';
import { createProvider, getWalletFromSeed } from '@/utils/wallet';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import * as anchor from '@project-serum/anchor';
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

const signingOracle = anchor.web3.Keypair.fromSecretKey(
  Buffer.from(JSON.parse(process.env.SIGNING_ORACLE_PRIVATE_KEY))
);
const provider = createProvider(new anchor.Wallet(signingOracle));
const program = new anchor.Program(
  GIT_TO_EARN_IDL,
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
  if (req.method === 'POST') {
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
      if (event === 'pull_request' && payload.action === 'closed') {
        const merged = payload.pull_request.merged;
        if (merged) {
          const owner: string = payload.repository.owner.login;
          const repo: string = payload.repository.name;

          let regex = /Fixes #(\d+)/;
          let match = payload.pull_request.body.match(regex);
          if (!match) {
            return res.status(400).json({
              message: 'Linked Issue not found',
            });
          }
          const { data } = await octokit.request(
            'GET /orgs/{org}/installation',
            {
              org: owner,
            }
          );
          const installationAuth = await auth({
            type: 'installation',
            installationId: data.id,
          });
          const installationOctokit = new Octokit({
            auth: installationAuth.token, // directly pass the token
          });

          const issueNumber = match[1];
          const issueDescription = (
            await installationOctokit.rest.issues.get({
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
            return res.status(400).json({
              message: 'Linked Bounty not found',
            });
          }

          const bounty = match[1];

          const fromSeed = owner;
          const toSeed = payload.pull_request.user.login;
          console.log('transfering...');
          const response = await program.methods
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
          console.log('Transfer response:', response);
        }
      }

      return res.status(200).json({
        message: 'Success',
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        message: 'Failed to handle webhook event',
      });
    }
  }
  return res.status(404).json({
    message: 'Not found',
  });
}
