import { Container } from '@/components/Layout/Container';
import { Footer } from '@/components/Layout/Footer';
import { Header } from '@/components/Layout/Header';
import OrganisationsList from '@/components/Organisations/OrganisationsList';
import Head from 'next/head';

const OrganisationsPage = () => {
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
        <Container className='pb-8'>
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
