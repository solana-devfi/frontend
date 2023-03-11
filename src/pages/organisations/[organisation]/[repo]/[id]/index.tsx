import { Container } from '@/components/Layout/Container';
import { Footer } from '@/components/Layout/Footer';
import { Header } from '@/components/Layout/Header';
import ItemDetails from '@/components/Item/ItemDetails';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useRepoIssues from '@/hooks/useRepoIssues';
import { useEffect, useState } from 'react';

const ItemPage = () => {
  const router = useRouter();
  const {
    organisation: organisationName,
    repo: repoName,
    id: issueNumber,
  } = router.query;

  return (
    <>
      <Head>
        <title>DevFi - Git to Earn for Developers</title>
        <meta
          name="description"
          content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
        />
      </Head>
      <Header />
      <main className="dark:bg-slate-900">
        <Container>
          <ItemDetails
            issueNumber={issueNumber.toString()}
            organisationName={organisationName.toString()}
            repoName={repoName.toString()}
          />
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default ItemPage;
