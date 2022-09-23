import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import ActionButton from '../../../components/actionButton';
import { BaseLayout } from '../../../components/baseLayout';
import Header from '../../../components/header';
import { trpc } from '../../../utils/trpc';

const CreateChannel: NextPage = () => {

	const [channelName, setChannelName] = useState('');
	const [channelDesc, setChannelDesc] = useState('');
	const router = useRouter();

	const newChannel = trpc.useMutation(['channel.create'], {
		onSettled(data) {
			router.push(`/app?channel=${data!.id!}`);
		},
	});

	const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
		setChannelName(event.target.value);
	};

	const handleChangeDesc = (event: ChangeEvent<HTMLInputElement>) => {
		setChannelDesc(event.target.value);
	};

	const handleSubmit = async (event: React.MouseEvent) => {
		await newChannel.mutateAsync({ name: channelName });
	};

	return (
		<BaseLayout>
			<>
				<Header />
				<div className="flex flex-col gap-2 p-8 rounded-md drop-shadow-2xl">
					<p>Create Channel</p>
					<div className="flex">
						<div className="pl-2 rounded-l-md bg-zinc-600">
							<p className="text-2xl p-1">#</p>
						</div>
						<input
							type="text"
							className=" bg-zinc-600 p-2 rounded-r-md flex-grow focus:outline-none"
							placeholder="name your channel"
							onChange={handleChangeName}
							value={channelName}
						></input>
					</div>
					<div className='self-center'>
					<ActionButton action={handleSubmit} caption="Create" />
						
					</div>
				</div>
			</>
		</BaseLayout>
	);
};

export default CreateChannel;
