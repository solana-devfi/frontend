// import { Button } from '@/components/Layout/Button';
import { Container } from '@/components/Layout/Container';
import { Footer } from '@/components/Layout/Footer';
import { Header } from '@/components/Layout/Header';
import createWebhook from '@/pages/api/githubWebhook';
import RepoDetails from '@/components/Repo/RepoDetails';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useRepoIssues from '@/hooks/useRepoIssues';

const RepoPage = () => {
  const router = useRouter();
  const { organisation: organisationName, repo: repoName } = router.query;

  if (!organisationName || !repoName) {
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
            <h1 className="text-4xl font-extrabold dark:text-slate-200">
              No repo found!
            </h1>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

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
          <RepoDetails
            repoName={repoName.toString()}
            organisationName={organisationName.toString()}
          />
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default RepoPage;
