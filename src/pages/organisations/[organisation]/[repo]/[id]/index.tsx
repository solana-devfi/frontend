import { Container } from '@/components/Container';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import ItemDetails from '@/components/Item/ItemDetails';
import organisations from '@/data/organisations';
import Head from 'next/head';
import { useRouter } from 'next/router';

const ItemPage = () => {
  const router = useRouter();
  const { organisation: organisationName, repo: repoName, id } = router.query;

  const item = organisations
    .find((organisation) => organisation.name === organisationName)
    ?.repos.find((repo) => repo.name === repoName)
    ?.latestItems.find((item) => item.id === +id.toString());

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
          {item ? (
            <ItemDetails
              {...item}
              repoName={repoName.toString()}
              organisationName={organisationName.toString()}
            />
          ) : (
            <h1 className="text-4xl font-extrabold dark:text-slate-200">
              No item found!
            </h1>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default ItemPage;
