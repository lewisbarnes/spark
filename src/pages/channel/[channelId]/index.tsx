import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BaseLayout } from '../../../components/baseLayout';
import { ChatBox } from '../../../components/chatBox';
import { trpc } from '../../../utils/trpc';
import ErrorPage from 'next/error';
import LinkButton from '../../../components/linkButton';

const ChannelPage: NextPage = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const { channelId } = router.query;
	const {
		data: channel,
		isLoading,
		isError,
	} = trpc.useQuery([
		'channel.getById',
		{ channelId: typeof channelId == 'string' ? channelId : '' },
	]);

	if (isLoading) {
		return (
			<BaseLayout>
				<p>Loading...</p>
			</BaseLayout>
		);
	}

	if (channel) {
		return (
			<>
				<Head>
					<title>{`Spark | #${channel?.name}`}</title>
					<meta name="description" content="A chat app" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<BaseLayout>
					<>
						<div className="flex flex-col items-end gap-2 m-4 max-h-screen">
							<div className="flex justify-end">
								<h1 className='text-xl'>Actions ⮟</h1>
							</div>
							{session?.user?.id! == channel.userId && (
								<div className="flex-col items-end gap-2 p-2 hidden">
									<LinkButton href={`/channel/${channelId}/delete`} caption="Edit Channel" />
									<LinkButton href={`/channel/${channelId}/delete`} caption="Delete Channel" />
								</div>
							)}
						</div>
						<div className="flex flex-col mt-4 px-4 gap-2 h-full flex-grow rounded-t-md">
							<ChatBox channelId={channel?.id!} compact={true} />
						</div>
					</>
				</BaseLayout>
			</>
		);
	} else {
		return (
			<BaseLayout>
				<div className="flex flex-col mt-4 p-4 gap-2 bg-zinc-800 max-h-screen flex-grow rounded-t-md">
					<ErrorPage statusCode={404}></ErrorPage>
				</div>
			</BaseLayout>
		);
	}
};

export default ChannelPage;
