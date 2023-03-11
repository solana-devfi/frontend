import { NextApiRequest, NextApiResponse } from "next";
import * as anchor from '@project-serum/anchor'
import { createProvider, getProxyFromSeed } from "@/utils/wallet";
import { GitToEarn } from '@/data/idl';
import idl from '@/data/idl.json';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method === 'POST') {
    const { signature, publicKey, id, isOrg } = req.body;

    const proxy = getProxyFromSeed(id, program.programId);

    const transaction = await program.methods.initializeUserOwner(id, isOrg).accounts({
      walletProxy: proxy,
      state,
      signingOracle: signingOracle.publicKey,
      signer: publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([signingOracle]).transaction();

    transaction.addSignature(publicKey, signature);

    await provider.send(transaction);
  } else {
    res.status(400)
  }
}
