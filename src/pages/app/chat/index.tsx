import { NextPage, NextPageContext } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaBars, FaComment, FaHandMiddleFinger, FaUser, FaWindowClose } from 'react-icons/fa';
import { ChatBox } from '../../../components/chat/chatBox';
import Header from '../../../components/header';
import { trpc } from '../../../utils/trpc';
import { createPortal } from 'react-dom';
import Portal from '../../../components/portal';
import ToolTip from '../../../components/tooltip';
import UserList from '../../../components/userList';

const ChatHome: NextPage<{ channel: string }> = ({ channel }) => {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { data: channels, isLoading: channelsLoading } = trpc.channel.getAll.useQuery();
  const [channelId, setChannelId] = useState(channel);

  const [channelsHidden, setChannelsHidden] = useState(false);

  const [showTooltip, setShowToolTip] = useState(false);
  const [tooltipText, setToolTipText] = useState('');

  const [showWelcome, setShowWelcome] = useState(true);

  const [toolTipPos, setToolTipPos] = useState({ clientY: 0, clientX: 0 });

  useEffect(() => {
    if (channel) {
      setChannelId(channel);
    }
  }, [channel, toolTipPos]);

  return (
    <div className="flex h-screen flex-col bg-neutral-200 px-3 dark:bg-zinc-800">
      <Head>
        <title>Spark</title>
        <meta name="description" content="A chat app" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:image"
          content={`https://ogi.sh?title=Spark%20Chat&unsplashId=rCbdp8VCYhQ`}
        />
      </Head>
      <div className="-mx-1">
        <Header />
      </div>

      <div className="flex h-auto w-full flex-grow flex-col bg-neutral-200 dark:bg-zinc-800">
        <div className={`flex h-full gap-3`}>
          <div className="scrollbar-thin relative max-h-[93.8vh] space-y-1 overflow-y-auto border-r bg-zinc-800 pr-2 dark:border-zinc-600 md:static md:z-0">
            <FaComment className="mx-auto mb-3" />
            {channels?.map((channel) => (
              <div className="relative">
                <Link key={channel.id} href={`/app/chat?c=${channel.id}`}>
                  <a
                    className={[
                      'relative block select-none rounded-md border border-transparent p-2 text-sm hover:cursor-pointer dark:hover:border-zinc-600',
                      channelId == channel.id ? ' bg-neutral-300 dark:bg-purple-400' : '',
                    ].join(' ')}
                    onMouseEnter={(e) => {
                      setShowToolTip(true);
                      setToolTipText(channel.name);
                      setToolTipPos({
                        clientY:
                          e.currentTarget.getBoundingClientRect().y +
                          e.currentTarget.getBoundingClientRect().height / 4,
                        clientX: e.currentTarget.getBoundingClientRect().x,
                      });
                    }}
                    onMouseLeave={() => setShowToolTip(false)}
                  >
                    <i className="[writing-mode:vertical-rl]">#{channel.name}</i>
                  </a>
                </Link>
              </div>
            ))}
            {showTooltip && (
              <ToolTip
                value={`#${tooltipText}`}
                pos={{ x: toolTipPos.clientX + 55, y: toolTipPos.clientY }}
              ></ToolTip>
            )}
          </div>

          <div className="flex h-full flex-grow">
            {channelId ? (
              <ChatBox channelId={channelId} compact={true} />
            ) : (
              <div className="mx-auto my-auto w-full text-center text-4xl text-zinc-600">
                No channel selected
              </div>
            )}
          </div>
          <UserList />
        </div>
      </div>
      {showWelcome && (
        <Portal>
          <div className="pointer-events-auto absolute z-50 flex h-screen w-screen backdrop-blur-md">
            <div className="relative my-auto mx-auto h-60 w-96 rounded-md border border-zinc-600 bg-zinc-800 p-4">
              <p className="text-center text-2xl">Warning!</p>
              <p className="text-center text-xl">
                Spark is in early development. There will be bugs. There will be missing features.
              </p>
              <button
                className="mx-auto mt-4 block rounded-md border px-4 py-2 hover:cursor-pointer"
                onClick={() => setShowWelcome(false)}
              >
                I understand
              </button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

ChatHome.getInitialProps = async (context: NextPageContext) => {
  const channel = context.query['c'];
  if (channel) {
    if (typeof channel === 'string') return { channel };
  }
  return { channel: '' };
};

export default ChatHome;
