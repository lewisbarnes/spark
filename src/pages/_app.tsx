// src/pages/_app.tsx
import { SessionProvider } from 'next-auth/react';
import type { AppType } from 'next/dist/shared/lib/utils';
import '../styles/globals.css';
import { withTRPC } from '../utils/trpc';
import version from '../../package.json';

const MyApp: AppType = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <div className="font-inter text-black dark:bg-zinc-800 dark:text-white">
      <div id={`portal-root`} className=" pointer-events-none absolute h-full w-full"></div>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  );
};

export default withTRPC(MyApp);
