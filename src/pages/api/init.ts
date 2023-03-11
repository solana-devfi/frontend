import { NextApiRequest, NextApiResponse } from "next";
import * as anchor from '@project-serum/anchor'
import { createProvider } from "@/utils/wallet";
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


export default async function payload(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method === 'POST') {
    const { signature, publicKey, devId, isOrg } = req.body;

    await program.methods.initializeUserOwner(devId, isOrg).accounts({
      walletProxy: devProxy,
      state,
      signingOracle: signingOracle.publicKey,
      signer: program.provider.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([signingOracle]).rpc();

  } else {
    res.status(400)
  }
}
