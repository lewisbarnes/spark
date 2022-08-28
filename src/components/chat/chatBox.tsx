import { Message, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Pusher from 'pusher-js';
import { createRef, FC, KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { BaseEditor, createEditor, Descendant, Editor, Node, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import { trpc } from '../../utils/trpc';
import { MessageUserDisplay } from '../messageUserDisplay';
import ProcessedMessage from '../processedMessage';

type Props = {
	compact: boolean;
	channelId: string;
};

type PusherMessage = {
	message: { content: string; id: string };
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
type CustomText = { text: string };
type CustomElement = { type: 'paragraph'; children: CustomText[] };
declare module 'slate' {
	interface CustomTypes {
		Editor: BaseEditor & ReactEditor & HistoryEditor;
		Element: CustomElement;
		Text: CustomText;
	}
}

export const ChatBox: FC<Props> = ({ channelId, compact }) => {
	let [message, setMessage] = useState('');
	let [messages, setMessages] = useState(new Array<PusherMessage>());
	let [members, setMembers] = useState(new Array<PusherMember>());
	let [keydown, setKeyDown] = useState(false);
	const initialTextNode = [
		{
			type: 'paragraph',
			children: [{ text: '' }],
		},
	] as Descendant[];
	const [value, setValue] = useState<Descendant[]>(initialTextNode);
	const editor = useMemo(() => withReact(createEditor()), []);
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
			setMessages((prevMessages) => [
				{ message: { content: data.content, id: data.id }, sender: session.data?.user! },
				...prevMessages,
			]);
		},
		onError(error) {
			alert(error.message);
		},
	});
	const session = useSession();
	const handleKeyDown = async (e: KeyboardEvent) => {

		if (!e.shiftKey && e.key === 'Enter') {
			e.preventDefault();
			if (keydown) {
				return;
			}
			setKeyDown(true);
			await sendMessage();
			setTimeout(() => {
				setKeyDown(false);
			}, 100);
		}
	};

	const sendMessage = async () => {
		const messageString = value.map((x) => Node.string(x)).join('\n');
		if (messageString === '') {
			return;
		}
		await mutateAsync({
			content: messageString,
			channelId: channelId,
		});
		Transforms.delete(editor, {
			at: {
				anchor: Editor.start(editor, []),
				focus: Editor.end(editor, []),
			},
		});
		setValue(initialTextNode);
	};

	useEffect(() => {
		const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: 'eu' });
		const messageChannel = pusher.subscribe(channelId);

		messageChannel.bind('new-message', function (data: PusherMessage) {
			if (data.sender.id != session.data?.user!.id) {
				setMessages((prevMessages) => [data, ...prevMessages]);
			}
		});

		messageChannel.bind('message-deleted', function (data: PusherMessage) {
			const messageClone = [...messages];
			const message = messageClone.findIndex((x) => x.message.id == data.message.id);
			if (message > -1) {
				messageClone.splice(message, 1);
				setMessages(messageClone);
			}
		});
	}, []);

	return (
		<div className={`flex flex-col flex-start min-w-full rounded-md`}>
			<p className="mb-4 text-xl">#{channelQuery.data?.name}</p>
			<div className=" bg-zinc-200 dark:bg-zinc-600 max-h-[40rem] overflow-y-auto flex flex-col-reverse rounded-t-md text-sm">
				<div className="flex flex-col-reverse py-2 min-h-[32rem]">
					{messages
						.map((x) => {
							return {
								content: x.message.content,
								id: x.message.id,
								user: x.sender,
							} as unknown as Message & { user: User };
						})
						.concat(
							messageData
								? messageData.filter((x, i) => messages?.findIndex((y) => y.message.id == x.id) < 0)
								: []
						)
						.map((x, i) => (
							<>
								<div className="flex hover:bg-zinc-800 py-1">
									<div className="flex pr-2" key={i}>
										<MessageUserDisplay user={x.user} compact={compact} />
									</div>
									<ProcessedMessage
										message={x.content}
										compact={compact}
										messageId={x.id}
										channelId={channelId}
										key={x.id}
									/>
								</div>
							</>
						))}
				</div>
			</div>
			<div className="flex-grow border-t-2 border-zinc-400">
				<Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
					<div className="flex">
						<Editable
							className='"bg-zinc-200 dark:bg-zinc-600 p-2 rounded-b-md w-full max-h-[5rem] overflow-y-auto'
							placeholder={`message #${channelQuery.data?.name}`}
							onKeyDown={handleKeyDown}
						/>
						{/* <button onClick={sendMessage} className="bg-teal-600 px-8 rounded-br-md">
							<FaTelegramPlane />
						</button> */}
					</div>
				</Slate>
			</div>
		</div>
	);
};
