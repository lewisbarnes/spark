import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useState } from 'react';
import { BaseLayout } from '../../components/baseLayout';
import { ModalContainer } from '../../components/modal/modalContainer';
import { ModalLayout } from '../../components/modal/modalLayout';
import { NavBar } from '../../components/navBar';
import { trpc } from '../../utils/trpc';

const CreateChannelPage: NextPage = () => {
	const router = useRouter();

	let [channelName, setChannelName] = useState('');
	const newChannel = trpc.useMutation(['channel.create'], {
		onSettled(data, error, variables, context) {
			router.back();
		},
	});

	const handleClick = (event: React.MouseEvent) => {
		if (event.target === event.currentTarget) {
			router.back();
		}
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setChannelName(event.target.value);
	};

	const handleSubmit = async (event: React.MouseEvent) => {
		await newChannel.mutate({ name: channelName });
	};

	return (
		<>
			<Head>
				<title>{`Spark | Create Channel `}</title>
				<meta name="description" content="A chat app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<ModalLayout onClick={handleClick}>
				<ModalContainer>
					<div>
						<div className="flex flex-col gap-2">
							<p>Create Channel</p>
							<input
								type="text"
								className=" bg-zinc-600 p-2 rounded-l-md flex-grow focus:outline-none"
								placeholder="name your channel"
								onChange={handleChange}
								value={channelName}
							></input>
							<button
								className="bg-purple-400 px-2 rounded-md text-zinc-900"
								onClick={handleSubmit}
							>
								Create
							</button>
						</div>
					</div>
				</ModalContainer>
			</ModalLayout>
			<BaseLayout>
				<div></div>
			</BaseLayout>
		</>
	);
};

export default CreateChannelPage;
