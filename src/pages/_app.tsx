// src/pages/_app.tsx
import { SessionProvider } from 'next-auth/react';
import type { AppType } from 'next/dist/shared/lib/utils';
import '../styles/globals.css';
import { trpc } from '../utils/trpc';
import { name, version } from '../../package.json'

const MyApp: AppType = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <div className="dark:bg-black dark:text-white font-inter">
      <SessionProvider session={session}>
        <div className="fixed top-2 inset-x-1/3 text-red-400 z-50 text-center rounded-md bg-opacity-20 pointer-events-none text-sm">
          DEVELOPMENT BUILD | {name} v{version}
        </div>
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  );
};

export default trpc.withTRPC(MyApp);
