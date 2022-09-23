import type { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaDiscord } from 'react-icons/fa';
import ActionButton from '../components/actionButton';
import { BaseLayout } from '../components/baseLayout';
import { UserDisplay } from '../components/userDisplay';
import defaultCss from '../utils/defaultCss';

type TechnologyCardProps = {
	name: string;
	description: string;
	documentation: string;
};

const Home: NextPage = () => {
	const { data: session } = useSession();
	const router = useRouter();
	return (
		<>
			<Head>
				<title>Spark</title>
				<meta name="description" content="A chat app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<BaseLayout>
				<>
					<div className="pt-32 pb-4 h-screen z-10 flex flex-col gap-4">
						<div className="self-center font-bold text-6xl text-zinc-800 bg-purple-400 p-4 rounded-full text-center">Spark</div>
						<div className="self-center mt-10 text-white">
							{session && (
								
								<div className="flex flex-col gap-4">
									<p className='text-center text-lg'>Signed in as</p>
									<UserDisplay user={session.user!}/>
									<ActionButton
										action={() => router.push('/app')}
										caption="Open Spark"
									/>
									{/* <ActionButton action={() => signOut()} caption="Sign Out" /> */}
								</div>
							)}
							{!session && <div className={defaultCss.button + ' flex gap-2 py-1'} onClick={() => signIn('discord')}><div className='my-auto'><FaDiscord/></div>Sign In</div>}
						</div>
						<div className='flex-grow'>

						</div>
					</div>
				</>
			</BaseLayout>
		</>
	);
};

export default Home;
