import GIT_TO_EARN_IDL from '@/data/idl';
import { createProvider, getProxyFromSeed } from '@/utils/wallet';
import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { NextApiRequest, NextApiResponse } from 'next';

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'POST') {
    const { recentBlockhash, publicKey, id, isOrg } = JSON.parse(req.body);
    console.log({ recentBlockhash, publicKey, id, isOrg });
    const userPublicKey = new PublicKey(publicKey);

    const proxy = getProxyFromSeed(id, program.programId);

    const transaction = await program.methods
      .initializeUserOwner(id, isOrg)
      .accounts({
        walletProxy: proxy,
        state,
        signingOracle: signingOracle.publicKey,
        signer: userPublicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .transaction();
    transaction.recentBlockhash = recentBlockhash;
    transaction.feePayer = userPublicKey;

    transaction.partialSign(signingOracle);

    return res.status(200).json({
      message: 'success',
      signature: transaction.signatures.find(
        (signature) =>
          signature.publicKey.toBase58() === signingOracle.publicKey.toBase58()
      ).signature,
    });
  } else {
    return res.status(400).json({
      message: 'error',
    });
  }
}
