import { Container } from '@/components/Container';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import RepoDetails from '@/components/Repo/RepoDetails';
import organisations from '@/data/organisations';
import Head from 'next/head';
import { useRouter } from 'next/router';

const RepoPage = () => {
  const router = useRouter();
  const { organisation: organisationName, repo: repoName } = router.query;

  const repo = organisations
    .find((organisation) => organisation.name === organisationName)
    ?.repos.find((repo) => repo.name === repoName);

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
          {repo ? (
            <RepoDetails {...repo} />
          ) : (
            <h1 className="text-4xl font-extrabold dark:text-slate-200">
              No repo found!
            </h1>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default RepoPage;
