import { NextPage, NextPageContext } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BaseLayout } from '../../components/baseLayout';
import { ChatBox } from '../../components/chat/chatBox';
import { trpc } from '../../utils/trpc';

const AppHome: NextPage<{ channel: string }> = ({ channel }) => {
	const { data: session, status: authStatus } = useSession();
	const router = useRouter();
	const { data: channels, isLoading: channelsLoading } = trpc.useQuery(['channel.getAll']);
	const [channelId, setChannelId] = useState<string | null>(null);

	useEffect(() => {
		// return the user outside of the app if not authenticated
		if (authStatus == 'unauthenticated') {
			router.push('/');
		}

		if (channel !== '') {
			setChannelId(channel);
		}
	}, [authStatus, channel, router]);

	if (authStatus !== 'authenticated') {
		<Head>
			<title>Spark</title>
			<meta name="description" content="A chat app" />
			<link rel="icon" href="/favicon.ico" />
		</Head>;
		return <p className="my-auto mx-auto text-2xl">Loading...</p>;
	} else {
		return (
			<>
				<Head>
					<title>Spark</title>
					<meta name="description" content="A chat app" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
					<>
						<div className="h-screen flex flex-col gap-2 dark:bg-zinc-900">
							<div className="p-2 bg-neutral-300 dark:bg-zinc-800 drop-shadow-md flex">
								<Link href="/app">
									<div className="font-bold text-2xl self-start text-purple-400 hover:cursor-pointer">
										Spark
									</div>
								</Link>
							</div>
							<div className="flex gap-1 flex-grow mb-2">
								<div className="h-full self-start border-r-2 dark:border-zinc-800 w-48">
									{channels?.map((channel) => (
										<div
											className={[
												'text-md rounded-md p-2 m-2 hover:bg-neutral-300 dark:hover:bg-zinc-600 hover:cursor-pointer',
												channelId == channel.id ? ' bg-neutral-300 dark:bg-zinc-600' : '',
											].join(' ')}
											key={channel.id}
											onClick={() => {
												setChannelId(channel.id);
												router.push(
													{ pathname: '/app', query: { channel: channel.id } },
													undefined,
													{
														shallow: true,
													}
												);
											}}
										>
											<i>#{channel.name}</i>
										</div>
									))}
								</div>
								<div className="h-full flex-grow flex rounded-md p-1">
									{channelId ? (
										<ChatBox channelId={channelId} compact={true} />
									) : (
										<div className="mx-auto my-auto text-4xl text-zinc-600">
											No channel selected
										</div>
									)}
								</div>
							</div>
						</div>
					</>
			</>
		);
	}
};

AppHome.getInitialProps = async (context: NextPageContext) => {
	if (context.query['channel'] !== undefined) {
		if (typeof context.query['channel'] === 'string') return { channel: context.query['channel'] };
	}
	return { channel: '' };
};

export default AppHome;
