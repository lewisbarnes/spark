import { TRPCClientError } from '@trpc/client';
import { useSession } from 'next-auth/react';
import { FC, KeyboardEvent, useMemo, useState } from 'react';
import { IconContext } from 'react-icons';
import { FaPlusCircle } from 'react-icons/fa';
import { BaseEditor, createEditor, Descendant, Editor, Node, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import superjson from 'superjson';
import { useMessageChannel } from '../../utils/hooks';
import MessageParser from '../../utils/messageParser';
import { trpc } from '../../utils/trpc';
import MessageComponent from './message';

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

export const ChatBox: FC<{ channelId: string; compact: boolean }> = ({ channelId }) => {
	const [value, setValue] = useState<Descendant[]>(initialTextNode);
	const [errorMessage, setErrorMessage] = useState('');
	const editor = useMemo(() => withReact(createEditor()), []);
	
	const { channel, messages } = useMessageChannel(channelId);

	const { status } = useSession();

	const addMutation = trpc.message.add.useMutation();

	const handleKeyDown = async (e: KeyboardEvent) => {
		if (!e.shiftKey && e.key === 'Enter') {
			e.preventDefault();
			await sendMessage();
		}
	};

	const sendMessage = async () => {
		if (value.map((x) => Node.string(x)).join('\n').trim() === '') {
			return;
		}
		const messageString = superjson.stringify(
			MessageParser(value.map((x) => Node.string(x)).join('\n').trim())
		);
		try {
			await addMutation.mutateAsync({
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
				if (e.cause) {
					setErrorMessage(e.cause.message);
				} else {
					setErrorMessage(e.message);
				}
			}
			return;
		}
		setValue(initialTextNode);
	};

	return (
		<div
			className="relative top-0 right-0 left-0 bottom-0 overflow-y-auto w-full"
		>
			<div className="absolute top-0 right-0 left-0 bottom-12">

				<div className="flex flex-col-reverse h-full overflow-y-auto">
					{messages?.map((x) => <MessageComponent message={x} key={x.id}/>)}
					<div className="text-center dark:text-zinc-600 select-none mb-10">
					This is the start of{' '}
					<span className="dark:text-zinc-500 font-bold">#{channel?.name}</span>
				</div>
				</div>
			</div>
			{errorMessage.length > 0 && (
				<div className="text-red-400 text-sm">{errorMessage}</div>
			)}
				<div className="flex absolute bottom-0 right-0 left-0">
					<div className="relative bg-neutral-300 dark:bg-zinc-600 justify-center p-2 flex flex-col rounded-l-md">
						<IconContext.Provider
							value={{ size: '16px', className: 'fill-zinc-400 hover:fill-purple-600' }}
						>
							<FaPlusCircle />
						</IconContext.Provider>
					</div>
					<Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
						<Editable
							className="bg-neutral-300 dark:bg-zinc-600 flex-grow my-auto overflow-y-auto rounded-r-md p-2"
							placeholder={status == "authenticated" ? `message #${channel?.name}` : 'login to chat'}
							readOnly = {status !== "authenticated"}
							onKeyDown={handleKeyDown}
						/>
					</Slate>
			</div>
		</div>
	);
};
