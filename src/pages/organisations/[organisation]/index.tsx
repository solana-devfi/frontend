import { Container } from '@/components/Layout/Container';
import { Footer } from '@/components/Layout/Footer';
import { Header } from '@/components/Layout/Header';
import OrganisationDetails from '@/components/Organisation/OrganisationDetails';
import useUserOrganisations from '@/hooks/useUserOrganisations';
import Head from 'next/head';
import { useRouter } from 'next/router';

const OrganisationPage = () => {
  const router = useRouter();
  const { organisation: orgName } = router.query;
  const { data, isLoading } = useUserOrganisations();
  const orgRepos = data?.repoList.filter(
    (repo) => repo.owner.login === orgName
  );

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
          {orgRepos?.length ? (
            <OrganisationDetails orgRepos={orgRepos} />
          ) : (
            <h1 className="text-4xl font-extrabold dark:text-slate-200">
              {isLoading ? 'Loading...' : 'No organisation found!'}
            </h1>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default OrganisationPage;
