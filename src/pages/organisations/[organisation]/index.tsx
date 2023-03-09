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

  const { data } = useUserOrganisations();
  const organisation = data?.data.find(
    (organisation) => organisation.login === orgName
  );

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
          {organisation ? (
            <OrganisationDetails {...organisation} />
          ) : (
            <h1 className="text-4xl font-extrabold dark:text-slate-200">
              No organisation found!
            </h1>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default OrganisationPage;
