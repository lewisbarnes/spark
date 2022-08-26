import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ChangeEvent, FC, MouseEventHandler, useState } from 'react';
import { BaseLayout } from '../baseLayout';
import { ModalContainer } from './modalContainer';
import { ModalLayout } from './modalLayout';
import { NavBar } from '../navBar';
import { trpc } from '../../utils/trpc';
import ActionButton from '../actionButton';

type Props = {
	callback: MouseEventHandler;
};

const CreateChannelModal: FC<Props> = ({ callback }) => {
	const router = useRouter();

	let [channelName, setChannelName] = useState('');
	let [channelDesc, setChannelDesc] = useState('');
	const newChannel = trpc.useMutation(['channel.create'], {
		onSettled(data, error, variables, context) {
			router.push(`/channel/${data?.id}`);
		},
	});

	const handleClick = (event: React.MouseEvent) => {
		if (event.target === event.currentTarget) {
			callback(event);
		}
	};

	const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
		setChannelName(event.target.value);
	};

	const handleChangeDesc = (event: ChangeEvent<HTMLInputElement>) => {
		setChannelDesc(event.target.value);
	};

	const handleSubmit = async (event: React.MouseEvent) => {
		await newChannel.mutateAsync({ name: channelName });
		callback(event);
	};

	return (
		<ModalLayout onClick={handleClick}>
			<ModalContainer>
				<div>
					<div className="flex flex-col gap-2 bg-zinc-800 border-2 border-zinc-600 p-8 rounded-md drop-shadow-2xl">
						<p>Create Channel</p>
						<div className="flex">
							<div className='pl-2 rounded-l-md bg-zinc-600'><p className='text-2xl p-1'>#</p></div>
							<input
								type="text"
								className=" bg-zinc-600 p-2 rounded-r-md flex-grow focus:outline-none"
								placeholder="name your channel"
								onChange={handleChangeName}
								value={channelName}
							></input>
						</div>
						<input
							type="text"
							className=" bg-zinc-600 p-2 rounded-md flex-grow focus:outline-none"
							placeholder="describe your channel"
							onChange={handleChangeDesc}
							value={channelDesc}
						></input>
						<ActionButton action={handleSubmit} caption="Create" />
					</div>
				</div>
			</ModalContainer>
		</ModalLayout>
	);
};

export default CreateChannelModal;
