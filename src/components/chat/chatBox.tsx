import { Message, User } from '@prisma/client';
import { TRPCClientError } from '@trpc/client';
import { useSession } from 'next-auth/react';
import Pusher from 'pusher-js';
import { FC, KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { IconContext } from 'react-icons';
import { FaPlusCircle } from 'react-icons/fa';
import { BaseEditor, createEditor, Descendant, Editor, Node, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import superjson from 'superjson';
import { clientEnv } from '../../env/schema.mjs';
import MessageParser from '../../utils/messageParser';
import { trpc } from '../../utils/trpc';
import { MessageUserDisplay } from '../messageUserDisplay';
import ProcessedMessage from '../processedMessage';

type CustomText = { text: string };
type CustomParagraph = { type: 'paragraph'; children: CustomText[] };
type CustomURL = { type: 'link'; children: CustomText[] };

declare module 'slate' {
	interface CustomTypes {
		Editor: BaseEditor & ReactEditor & HistoryEditor;
		Element: CustomParagraph | CustomURL;
		Text: CustomText;
	}
}

const initialTextNode = [
	{
		type: 'paragraph',
		children: [{ text: '' }],
	},
] as Descendant[];

export const ChatBox: FC<{ channelId: string; compact: boolean }> = ({ channelId, compact }) => {
	const [messages, setMessages] = useState(new Array<Message & { user: User }>());
	const [value, setValue] = useState<Descendant[]>(initialTextNode);
	const [errorMessage, setErrorMessage] = useState('');
	const editor = useMemo(() => withReact(createEditor()), []);
	const channelQuery = trpc.useQuery(['channel.getById', { channelId: channelId }]);

	const { data: messageData } = trpc.useQuery([
		'message.getByChannelId',
		{ channelId: channelId, num: 20 },
	]);

	const session = useSession();

	const sendMutation = trpc.useMutation(['message.add'], {
		onSuccess(data) {
			setMessages((prevMessages) => [
				{
					content: data.content,
					id: data.id,
					userId: data.user.id,
					channelId: channelId,
					timestamp: BigInt(Date.now()),
					user: data.user,
				},
				...prevMessages,
			]);
		},
		onError(error) {
			console.error(error);
		},
	});

	const handleKeyDown = async (e: KeyboardEvent) => {
		if (!e.shiftKey && e.key === 'Enter') {
			e.preventDefault();
			await sendMessage();
		}
	};

	const sendMessage = async () => {
		if(value.map((x) => Node.string(x)).join('\n') === '') {
			return;
		}
		const messageString = superjson.stringify(
			MessageParser(value.map((x) => Node.string(x)).join('\n'))
		);
		if (messageString === '[]') {
			return;
		}
		try {
			await sendMutation.mutateAsync({
				content: messageString,
				channelId: channelId,
			});
			Transforms.delete(editor, {
				at: {
					anchor: Editor.start(editor, []),
					focus: Editor.end(editor, []),
				},
			});
		} catch (e) {
			if (e instanceof TRPCClientError) {
				setErrorMessage(e.message);
			}
			return;
		}
		setValue(initialTextNode);
	};

	useEffect(() => {
		if (messageData) {
			setMessages(messageData);
		}
	}, [messageData]);

	useEffect(() => {
		const pusher = new Pusher(clientEnv.NEXT_PUBLIC_PUSHER_KEY!, { cluster: 'eu' });
		const pusherChannel = pusher.subscribe(channelId);
		pusherChannel
			.bind('new-message', function (data: { message: string; sender: User }) {
				const parsedMessage = superjson.parse<Message & { user: User }>(data.message);
				if (session.data && session.data.user) {
					if (parsedMessage.userId != session.data.user.id) {
						setMessages((prevMessages) => filterMessages([parsedMessage, ...prevMessages]));
					}
				}
			})
			.bind(
				'message-deleted',
				function (data: { message: { content: string; id: string }; sender: User }) {
					setMessages((prevMessages) => prevMessages.filter((x) => x.id !== data.message.id));
				}
			);
		return () => {
			pusherChannel.unbind_all();
			pusherChannel.unsubscribe();
			pusher.disconnect();
		};
	}, [messages]);

	const filterMessages = (messages: Array<Message & { user: User }>) => {
		return messages
			.concat(
				messageData ? messageData.filter((x) => messages?.findIndex((y) => y.id == x.id) < 0) : []
			)
			.sort((x, y) => (new Date(Number(x.timestamp)) < new Date(Number(y.timestamp)) ? 1 : -1));
	};

	return (
		<div className="flex flex-col w-full" id="chatBoxMAIN">
			<div className="flex flex-col-reverse flex-grow">
				{messages.map((x) => (
					<>
						<div
							className="flex hover:bg-neutral-300 hover:dark:bg-zinc-800 px-4 text-sm flex-wrap"
							key={x.id}
						>
							<div className="flex pr-2">
								<MessageUserDisplay user={x.user} />
							</div>
							<ProcessedMessage message={x.content} messageId={x.id} channelId={channelId} />
						</div>
					</>
				))}
			</div>
			{errorMessage.length > 0 && (
				<div className="mx-auto pt-2 px-2 text-red-400 text-sm">{errorMessage}</div>
			)}
			<div className="flex p-4">
				<div className="bg-neutral-300 dark:bg-zinc-600 justify-center p-2 flex flex-col rounded-l-md">
					<IconContext.Provider
						value={{ size: '16px', className: 'fill-zinc-400 hover:fill-white' }}
					>
						<FaPlusCircle />
					</IconContext.Provider>
				</div>
				<Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
					<Editable
						className="bg-neutral-300 dark:bg-zinc-600 flex-grow my-auto overflow-y-auto rounded-r-md p-2"
						placeholder={`message #${channelQuery.data?.name}`}
						onKeyDown={handleKeyDown}
					/>
				</Slate>
			</div>
		</div>
	);
};
