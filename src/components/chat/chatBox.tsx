import { TRPCClientError } from '@trpc/client';
import { useSession } from 'next-auth/react';
import { FC, KeyboardEvent, useMemo, useState } from 'react';
import { IconContext } from 'react-icons';
import {
  FaHandMiddleFinger,
  FaLink,
  FaPlusCircle,
  FaVideo,
  FaWindowRestore,
  FaWindows,
} from 'react-icons/fa';
import { BaseEditor, createEditor, Descendant, Editor, Node, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import superjson from 'superjson';
import { useMessageChannel } from '../../utils/hooks';
import MessageParser from '../../utils/messageParser';
import { trpc } from '../../utils/trpc';
import MessageComponent from './message';
import { openGraph } from '@/utils/openGraph';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useRouter } from 'next/router';

type CustomText = { text: string };
type CustomParagraph = { type: 'paragraph'; children: CustomText[] };
type CustomURL = { type: 'link'; children: CustomText[] };
type Default = { type: 'default'; children: CustomText[] };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomParagraph | CustomURL | Default;
    Text: CustomText;
  }
}

export const ChatBox: FC<{ channelId: string; compact: boolean }> = ({ channelId }) => {
  const initialTextNode = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ] as Descendant[];

  const [value, setValue] = useState<Descendant[]>(initialTextNode);
  const [errorMessage, setErrorMessage] = useState('');
  const editor = useMemo(() => withReact(createEditor()), []);

  const { channel, messages } = useMessageChannel(channelId);

  const { status } = useSession();

  const { mutateAsync: send } = trpc.message.send.useMutation();

  const [parent] = useAutoAnimate({ easing: 'linear', duration: 50 });

  const router = useRouter();

  const handleKeyDown = async (e: KeyboardEvent) => {
    if (!e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      await sendMessage();
    }
  };

  const sendTest = async (content: string) => {
    await send({
      content: content,
      channelId: channelId,
    });
  };

  const sendLipsum = async () => {
    let lipsum = '';
    await fetch('http://hipsum.co/api/?type=hipster-centric&paras=2&start-with-lorem=1')
      .then((response) => response.json())
      .then((json) => (lipsum = json.join('\n\n')))
      .catch((error) => console.error(error.message));

    await send({
      content: lipsum,
      channelId: channelId,
    });
  };

  const sendMessage = async () => {
    if (
      value
        .map((x) => Node.string(x))
        .join('\n')
        .trim() === ''
    ) {
      return;
    }
    const messageString = value
      .map((x) => Node.string(x))
      .join('\n')
      .trim();
    try {
      await send({
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
    <div className="relative top-0 right-0 left-0 bottom-4 mb-3 w-full overflow-y-auto">
      <div className="scrollbar-thin absolute top-0 bottom-20 right-0 left-0 flex select-text flex-col-reverse overflow-y-auto caret-transparent dark:text-white">
        {messages?.map((x) => (
          <MessageComponent message={x} key={x.id} />
        ))}
        <div className="mb-4 mt-4 flex-grow text-center dark:text-zinc-600">
          <p>
            This is the start of
            <span className="font-bold dark:text-zinc-500"> {channel?.name}</span>
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        {errorMessage.length > 0 && <div className="text-sm text-red-400">{errorMessage}</div>}
        <div className="flex items-center gap-2 rounded-md bg-neutral-300 p-2 dark:bg-zinc-600">
          <IconContext.Provider
            value={{ size: '16px', className: 'fill-zinc-400 hover:fill-purple-600 self-center' }}
          >
            <FaPlusCircle />
          </IconContext.Provider>
          <Slate editor={editor} value={value} onChange={(newValue) => setValue(newValue)}>
            <Editable
              className="my-auto flex-grow overflow-y-auto bg-neutral-300 dark:bg-zinc-600"
              placeholder={status == 'authenticated' ? `message ${channel?.name}` : 'login to chat'}
              readOnly={status !== 'authenticated'}
              onKeyDown={handleKeyDown}
            />
          </Slate>
        </div>
        <div className="relative flex gap-1 pt-2 text-sm [&>button]:border [&>button]:border-zinc-600 [&>*]:p-1 [&>*]:px-2">
          <button className="has-tooltip rounded-md" onClick={() => sendLipsum()}>
            <FaHandMiddleFinger />
            <span className="tooltip absolute -top-6 rounded-md border border-zinc-600 bg-zinc-800 p-1">
              Send hipsum
            </span>
          </button>
          <button
            className="has-tooltip rounded-md"
            onClick={() => sendTest('https://www.google.com')}
          >
            <FaLink />
            <span className="tooltip absolute -top-6 rounded-md border border-zinc-600 bg-zinc-800 p-1">
              Send a link
            </span>
          </button>
          <button
            className="has-tooltip rounded-md"
            onClick={() => sendTest('https://www.youtube.com/watch?v=KNyJFTtbJsA')}
          >
            <FaVideo />
            <span className="tooltip absolute -top-6 rounded-md border border-zinc-600 bg-zinc-800 p-1">
              Send a video link
            </span>
          </button>
          <button
            className="has-tooltip rounded-md"
            onClick={() => window.open(router.asPath, 'Popout', 'height=800,width=700')}
          >
            <FaWindowRestore />
            <span className="tooltip absolute -top-6 rounded-md border border-zinc-600 bg-zinc-800 p-1">
              Popout Chat
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
