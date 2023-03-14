import { Container } from '@/components/Layout/Container';
import { Footer } from '@/components/Layout/Footer';
import { Header } from '@/components/Layout/Header';
import PullRequestDetails from '@/components/PullRequest/PullRequestDetails';
import Head from 'next/head';
import { useRouter } from 'next/router';

function PullRequestPage() {
  const router = useRouter();
  if (!router.isReady) {
    return <div>loading...</div>;
  }

  const { organisation, repo, id } = router.query;

  return (
    <>
      <Head>
        <title>DevFi - Git to Earn for Developers</title>
        <meta
          name="description"
          content="Git to Earn. Developing the open source community."
        />
      </Head>
      <Header />
      <main className="dark:bg-slate-900">
        <Container className="pb-8">
          <PullRequestDetails
            pullRequestNumber={id.toString()}
            organisationName={organisation.toString()}
            repoName={repo.toString()}
          />
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default PullRequestPage;
