import 'focus-visible';
import '@/styles/tailwind.css';
import '@solana/wallet-adapter-react-ui/styles.css';

import { ContextProvider } from '@/contexts/ContextProvider';
import Notifications from '@/components/Notifications';

export default function App({ Component, pageProps }) {
  return (
    <ContextProvider>
      <Notifications />
      <Component {...pageProps} />
    </ContextProvider>
  );
}
