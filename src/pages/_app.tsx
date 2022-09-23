// src/pages/_app.tsx
import { SessionProvider } from 'next-auth/react';
import type { AppType } from 'next/dist/shared/lib/utils';
import '../styles/globals.css';
import { trpc } from '../utils/trpc';

const MyApp: AppType = ({ Component, pageProps: { session, ...pageProps } }) => {
	return (
		<div className='dark:bg-black dark:text-white font-inter'>
			<SessionProvider session={session}>
					<Component {...pageProps} />
			</SessionProvider>
		</div>
	);
};

export default trpc.withTRPC(MyApp);
