import { createRef, FC, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { IconContext } from 'react-icons';
import { FaTelegramPlane, FaTrashAlt } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { MessageUserDisplay } from './messageUserDisplay';
import { trpc } from '../utils/trpc';
import { z } from 'zod';
import Pusher from 'pusher-js';
import axios from 'axios';
import { User } from '@prisma/client';
import Link from 'next/link';
import ProcessedMessage from './processedMessage';

type Props = {
	compact: boolean;
	channelId: string;
};

type PusherMessage = {
	message: {content: string, id: string};
	sender: {
		id: string;
		name?: string | null | undefined;
		email?: string | null | undefined;
		image?: string | null | undefined;
	};
};

export type PusherMember = {
	id: string;
	info: {
		id: string;
		name?: string | null | undefined;
		email?: string | null | undefined;
		image?: string | null | undefined;
	};
};

export const ChatBox: FC<Props> = ({ channelId, compact }) => {
	let [message, setMessage] = useState('');
	let [messages, setMessages] = useState(new Array<PusherMessage>());
	let [members, setMembers] = useState(new Array<PusherMember>());
	let inputRef = createRef<HTMLInputElement>();
	const channelQuery = trpc.useQuery(['channel.getById', { channelId: channelId }]);
	const deleteMutation = trpc.useMutation(['message.delete']);
	const { data: messageData, isLoading } = trpc.useQuery([
		'message.getByChannelId',
		{ channelId: channelId, num: 20 },
	]);
	const utils = trpc.useContext();

	const { mutateAsync } = trpc.useMutation(['message.add'], {
		onSuccess(data) {			
			//setMessages((prevMessages) => [{message: {content: data.content, id: data.id}, sender: session.data?.user!}, ...prevMessages]);
		},
		onError(error) {
			alert(error.message);
		},
	});
	const session = useSession();
	const urlRE =
		/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

	const handleKeyDown = async (event: any) => {
		if (event.key === 'Enter') {
			if (message === '') {
				return;
			}
			await mutateAsync({ content: message, channelId: channelId });
			
			setMessage('');
			utils.invalidateQueries(['message.getByChannelId']);
		}
	};

	const handleOnChange = (event: any) => {
		let newMessage = event.target.value;
		setMessage(newMessage);
	};

	useEffect(() => {
		const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: 'eu' });
		const messageChannel = pusher.subscribe(channelId);

		messageChannel.bind('new-message', function (data: PusherMessage) {
				if(data.sender.id != session.data?.user!.id) {
					setMessages((prevMessages) => [data, ...prevMessages]);
				}
		});

		messageChannel.bind('message-deleted', function (data : PusherMessage) {
			const messageClone = [...messages];
			const message = messageClone.findIndex(x => x.message.id == data.message.id)
			if(message > -1) {
				messageClone.splice(message,1);
				setMessages(messageClone);
			}
		});
	}, []);
	

	return (
		<div className={`flex flex-col min-w-full rounded-md max-h-full`}>
			<p className="mb-4 text-xl">#{channelQuery.data?.name}</p>
			<div className=" bg-zinc-200 dark:bg-zinc-600 max-h-[40rem] overflow-y-auto flex flex-col-reverse rounded-t-md text-sm">
				<div className="flex flex-col-reverse gap-2 py-2 min-h-[32rem]">
					{messageData?.map((x, i) => (
						<>
							<div className="flex hover:bg-zinc-800 pr-2">
								<div className="flex pr-2" key={i}>
									<MessageUserDisplay user={x.user} compact={compact} />
								</div>
								<ProcessedMessage message={x.content} compact={compact} messageId={x.id} channelId={channelId} key={x.id + channelId}/>
							</div>
						</>
					))}
				</div>
			</div>

			<div className="flex z-10">
				<input
					type="text"
					placeholder={
						session.data?.user ? `message #${channelQuery.data?.name}` : 'sign in to send messages'
					}
					className="bg-zinc-200 dark:bg-zinc-600 border-t-2 border-zinc-400 focus:outline-none px-4 py-2 flex-grow placeholder:italic placeholder:text-zinc-400 rounded-b-md dark:text-zinc-200"
					ref={inputRef}
					id="textInput"
					onChange={handleOnChange}
					onKeyDown={handleKeyDown}
					value={message}
					disabled={!session.data?.user}
					autoComplete="off"
				></input>
				{/* <IconContext.Provider
					value={{ style: { verticalAlign: 'middle' }, className: 'fill-zinc-900' }}
				>
					<button className="bg-purple-400 px-8">
						<FaTelegramPlane />
					</button>
				</IconContext.Provider> */}
			</div>
			<div className="px-4 py-1 text-zinc-400 text-xs">
				<p>Tip: Global Twitch emotes are supported</p>
				{members.map((x) => (
					<p>{x.info.name}</p>
				))}
			</div>
		</div>
	);
};
