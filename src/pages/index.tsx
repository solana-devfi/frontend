import { Footer } from '@/components/Layout/Footer';
import { Header } from '@/components/Layout/Header';
import { Hero } from '@/components/Home/Hero';
import Head from 'next/head';

export default function Home() {
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
        <Hero />
      </main>
      <Footer />
    </>
  );
}
