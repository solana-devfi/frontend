import { Container } from '@/components/Container';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import OrganisationsList from '@/components/Organisations/OrganisationsList';
import Head from 'next/head';

const OrganisationsPage = () => {
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
            Your Organisations
          </h1>
          <OrganisationsList />
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default OrganisationsPage;
