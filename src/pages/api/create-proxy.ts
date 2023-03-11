import { NextApiRequest, NextApiResponse } from 'next';
import * as anchor from '@project-serum/anchor';
import { createProvider, getProxyFromSeed } from '@/utils/wallet';
import { GitToEarn } from '@/data/idl';
import idl from '@/data/idl.json';
import { PublicKey } from '@solana/web3.js';

const signingOracle = anchor.web3.Keypair.fromSecretKey(
  Buffer.from(JSON.parse(process.env.SIGNING_ORACLE_PRIVATE_KEY))
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === 'POST') {
    const { signature, recentBlockhash, publicKey, id, isOrg } = JSON.parse(
      req.body
    );
    const anchorPublicKey = new PublicKey(publicKey);
    const anchorSignature = Buffer.from(signature.data);

    console.log({ signature, recentBlockhash, publicKey, id, isOrg });
    const proxy = getProxyFromSeed(id, program.programId);

    const transaction = await program.methods
      .initializeUserOwner(id, isOrg)
      .accounts({
        walletProxy: proxy,
        state,
        signingOracle: signingOracle.publicKey,
        signer: anchorPublicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      // .signers([signingOracle])
      .transaction();
    transaction.recentBlockhash = recentBlockhash;
    transaction.feePayer = anchorPublicKey;
    transaction.addSignature(anchorPublicKey, anchorSignature);

    transaction.signatures.forEach((signature) => {
      if (signature.publicKey.toBase58() === anchorPublicKey.toBase58()) {
        signature.signature = anchorSignature;
      }
    });
    console.log(transaction);

    await provider.sendAndConfirm(transaction, [signingOracle]);
    return res.status(200).json({ message: 'success' });
  } else {
    return res.status(400).json({
      message: 'error',
    });
  }
}
