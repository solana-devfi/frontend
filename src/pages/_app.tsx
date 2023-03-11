import '@/styles/tailwind.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import 'focus-visible';

import Notifications from '@/components/Layout/Notifications';
import { ContextProvider } from '@/contexts/WalletContextProvider';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ContextProvider>
        <QueryClientProvider client={queryClient}>
          <Notifications />
          <Component {...pageProps} />
        </QueryClientProvider>
      </ContextProvider>
    </SessionProvider>
  );
}
