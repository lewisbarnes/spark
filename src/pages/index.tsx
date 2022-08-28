import type { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../utils/trpc';
import { useSession, signIn, signOut } from 'next-auth/react';
import { AuthButtons } from '../components/authButtons';
import { NavBar } from '../components/navBar';
import Image from 'next/image';
import { UserDisplay } from '../components/userDisplay';
import { ChatBox } from '../components/chat/chatBox';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ModalLayout } from '../components/modal/modalLayout';
import { ModalContainer } from '../components/modal/modalContainer';
import { BaseLayout } from '../components/baseLayout';
import LinkButton from '../components/linkButton';
import ActionButton from '../components/actionButton';
import CreateChannelModal from '../components/modal/createChannelModal';
import { useState } from 'react';

type TechnologyCardProps = {
	name: string;
	description: string;
	documentation: string;
};

const Home: NextPage = () => {
	const { data: session } = useSession();
	const { data, isLoading, isError } = trpc.useQuery(['channel.getAll']);
	const { invalidateQueries } = trpc.useContext();
	const [showModal, setShowModal] = useState(false);

	if (isLoading) {
		return (
			<>
				<Head>
					<title>Spark | Home</title>
					<meta name="description" content="A chat app" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<BaseLayout>
					<p>Loading...</p>
				</BaseLayout>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>Spark | Home</title>
				<meta name="description" content="A chat app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{showModal && (
				<CreateChannelModal
					callback={() => {
						setShowModal(false);
						invalidateQueries(['channel.getAll']);
					}}
				/>
			)}
			<BaseLayout>
				<>
					<div className="flex flex-col mt-4 gap-2 h-full rounded-t-md">
						<div className="flex">
							<h1 className="text-4xl flex-grow">Channels</h1>
							{session?.user && <ActionButton action={() => setShowModal(true)} caption="Create" />}
						</div>
						<div className="grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-2">
							{data?.map((x) => (
								<Link href={`/channel/${x.id}`}>
									<div
										className="hover:cursor-pointer hover:bg-zinc-600  border-zinc-600 border-2 p-4 rounded-md"
										key={x.id}
									>
										<p className="font-bold mb-2">#{x.name}</p>
										<UserDisplay
											user={x.createdBy}
											compact={false}
										/>
									</div>
								</Link>
							))}
						</div>
					</div>
				</>
			</BaseLayout>
		</>
	);
};

export default Home;
