import * as anchor from '@project-serum/anchor';
import { Connection, clusterApiUrl } from '@solana/web3.js';

export function getWalletFromSeed(
  seed: string,
  programId: anchor.web3.PublicKey
): anchor.web3.PublicKey {
  const [account, _] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('wallet'), Buffer.from(seed)],
    programId
  );
  return account;
}

export function createProvider(wallet: anchor.Wallet): anchor.Provider {
  const endpoint = clusterApiUrl('devnet');
  const connection = new Connection(endpoint);

  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: 'recent',
    commitment: 'recent',
  });

  return provider;
}

export function createProviderWithConnection(wallet, connection) {
  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: 'recent',
    // commitment: 'recent',
  });

  return provider;
}
