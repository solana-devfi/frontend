import idl from '@/data/idl.json';
import useOrganisationRepos from '@/hooks/useOrganisationRepos';
import useRepoIssues from '@/hooks/useRepoIssues';
import useRepoPRs from '@/hooks/useRepoPRs';
import { createProviderWithConnection, getProxyFromSeed } from '@/utils/wallet';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Avatars from './Avatars';

interface RepoDetailsProps {
  repoName: string;
  organisationName: string;
}

const createProxy = ({
  publicKey,
  id,
  isOrg,
  recentBlockhash,
}: {
  publicKey: PublicKey;
  id: string;
  isOrg: boolean;
  recentBlockhash: string;
}) => {
  return fetch('/api/create-proxy', {
    method: 'POST',
    body: JSON.stringify({
      publicKey,
      id,
      isOrg,
      recentBlockhash,
    }),
  }).then(
    (res) =>
      res.json() as Promise<{
        message: string;
        signature: Buffer;
      }>
  );
};

const RepoDetails = ({ repoName, organisationName }: RepoDetailsProps) => {
  const { data: reposData } = useOrganisationRepos(organisationName);
  const { data: pullRequestsData } = useRepoPRs(
    organisationName.toString(),
    repoName.toString()
  );
  const { data: issuesData } = useRepoIssues(
    organisationName.toString(),
    repoName.toString()
  );
  const [recentBlockhash, setRecentBlockhash] = useState<string>();
  const { publicKey, sendTransaction, wallet } = useWallet();
  const { connection } = useConnection();
  const { status, data: signature } = useQuery(
    ['create-proxy'],
    () =>
      createProxy({
        id: 'marcuspang',
        isOrg: false,
        publicKey,
        recentBlockhash,
      }),
    {
      enabled: Boolean(publicKey && recentBlockhash),
    }
  );

  useEffect(() => {
    if (connection) {
      connection
        .getLatestBlockhash('finalized')
        .then((res) => setRecentBlockhash(res.blockhash));
    }
  }, [connection]);

  useEffect(() => {
    if (signature && connection && wallet && publicKey) {
      const provider = createProviderWithConnection(connection, wallet);
      const program = new Program(
        idl as any,
        '8KFc1kae5g8LqAwmZHskgaSYjaHXpt9PCRwKNtuajgAa',
        provider
      );
      const proxy = getProxyFromSeed('marcuspang', program.programId);
      const signingOraclePubKey = new anchor.web3.PublicKey(
        'BH3d9LpBpfYaqFaQdc3Ty1Ak5YWzMUiSdq6JoE9GEgrU'
      );
      const [state, _] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('state')],
        program.programId
      );
      program.methods
        .initializeUserOwner('marcuspang', false)
        .accounts({
          walletProxy: proxy,
          state,
          signingOracle: signingOraclePubKey,
          signer: publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .transaction()
        .then((transaction) => {
          transaction.recentBlockhash = recentBlockhash;
          transaction.feePayer = publicKey;

          transaction.addSignature(
            signingOraclePubKey,
            Buffer.from(signature.signature)
          );
          return sendTransaction(transaction, connection, { maxRetries: 5 });
        });
    }
  }, [connection, signature, publicKey, recentBlockhash, sendTransaction, wallet]);

  const repo = reposData?.data.find((repo) => repo.name === repoName);
  if (!repo) {
    return (
      <div>
        <h1 className="mb-2 text-5xl font-extrabold dark:text-slate-200">
          No repo found
        </h1>
      </div>
    );
  }
  return (
    <div className="pb-12">
      <div className="flex justify-between">
        <div className="pb-8">
          <h1 className="mb-2 text-5xl font-extrabold dark:text-slate-200">
            {repo.name}
          </h1>
          <h2 className="mb-2 text-xl font-semibold dark:text-slate-400">
            {repo.full_name}
          </h2>
          {/* <span className="text-3xl font-bold dark:text-slate-200">
            1.1 SOL
          </span> */}
        </div>
        <div className="pt-8">
          {/* <button
            className="group mb-6 inline-flex items-center justify-center rounded-lg bg-blue-600 py-2 px-4 text-lg font-semibold text-white hover:bg-blue-500 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-800 active:text-blue-100 dark:bg-blue-800 dark:hover:bg-blue-700 dark:active:bg-blue-600"
            color="blue"
            onClick={() => {}}
          >
            Create Webhook
          </button> */}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold dark:text-slate-200">
          Pull Requests
        </h3>
        <a
          className="group mb-6 inline-flex items-center justify-center rounded-lg bg-blue-600 py-2 px-4 text-lg font-semibold text-white hover:bg-blue-500 hover:text-slate-100 hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-800 active:text-blue-100 dark:bg-blue-800 dark:hover:bg-blue-700 dark:active:bg-blue-600"
          color="blue"
          href={`https://github.com/${organisationName}/${name}/compare`}
          target={'_blank'}
          rel="noreferrer"
        >
          <ExternalLinkIcon className="mr-2 flex h-6 w-6" /> Add PR
        </a>
      </div>
      <div className="relative mb-12 overflow-x-auto rounded-lg dark:bg-slate-800">
        <table className="w-full table-auto border-collapse text-left">
          <thead>
            <tr className="text-sm dark:text-slate-400">
              <th className="py-3 pl-4">NO.</th>
              <th className="py-3 pl-4">NAME</th>
              <th className="py-3 pl-4">CONTRIBUTORS</th>
              <th className="py-3 pl-4">UPDATED</th>
              <th className="py-3 pl-4">STATUS</th>
            </tr>
          </thead>
          <tbody className="dark:text-slate-200">
            {pullRequestsData?.data.length
              ? pullRequestsData.data.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors dark:bg-slate-900/80 dark:hover:bg-slate-900/60"
                  >
                    <td className="py-4 pl-4">{item.number}</td>
                    <td className="py-4 pl-4">
                      <Link
                        href={`/organisations/${repo.full_name}/${item.number}`}
                        className="hover:underline"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="py-4 pl-4">
                      <Avatars assignees={item.assignees} />
                    </td>
                    <td className="py-4 pl-4">
                      <span>
                        {new Date(item.updated_at).toLocaleDateString()}{' '}
                        {new Date(item.updated_at).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="py-4 pl-4">{item.state}</td>
                  </tr>
                ))
              : undefined}
          </tbody>
        </table>
      </div>
      <h3 className="pb-6 text-2xl font-bold dark:text-slate-200">Issues</h3>
      <div className="relative overflow-x-auto rounded-lg dark:bg-slate-800">
        <table className="w-full table-auto border-collapse text-left shadow">
          <thead>
            <tr className="text-sm dark:text-slate-400">
              <th className="py-3 pl-4">NO.</th>
              <th className="py-3 pl-4">NAME</th>
              <th className="py-3 pl-4">CONTRIBUTORS</th>
              <th className="py-3 pl-4">UPDATED</th>
              <th className="py-3 pl-4">BOUNTY</th>
              <th className="py-3 pl-4">STATUS</th>
            </tr>
          </thead>
          <tbody className="dark:text-slate-200">
            {issuesData?.data.length
              ? issuesData.data.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors dark:bg-slate-900/80 dark:hover:bg-slate-900/60"
                  >
                    <td className="py-4 pl-4">{item.number}</td>
                    <td className="py-4 pl-4">
                      <Link
                        href={`/organisations/${repo.full_name}/${item.number}`}
                        className="hover:underline"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="py-4 pl-4">
                      <Avatars assignees={item.assignees} />
                    </td>
                    <td className="py-4 pl-4">
                      <span>
                        {new Date(item.updated_at).toLocaleDateString()}{' '}
                        {new Date(item.updated_at).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="py-4 pl-4">
                      <span className="font-bold dark:text-green-700">
                        {
                          //  @ts-ignore
                          item.bounty
                        }
                      </span>
                    </td>
                    <td className="py-4 pl-4">{item.state}</td>
                  </tr>
                ))
              : undefined}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepoDetails;
