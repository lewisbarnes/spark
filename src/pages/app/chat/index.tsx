import { NextPage, NextPageContext } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { ChatBox } from '../../../components/chat/chatBox';
import Header from '../../../components/header';
import { trpc } from '../../../utils/trpc';

const ChatHome: NextPage<{ channel: string }> = ({ channel }) => {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const { data: channels, isLoading: channelsLoading } = trpc.channel.getAll.useQuery();
  const [channelId, setChannelId] = useState<string | null>(null);

  const [channelsHidden, setChannelsHidden] = useState(false);

  const getChannelListCSS = () => {
    if (channelsLoading) {
      return;
    }
    const isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
    const baseCSS = '';
    if (isMobile) {
      return `absolute z-50 flex flex-col ${baseCSS}`;
    }
    return `${baseCSS}`;
  };

  useEffect(() => {
    if (!navigator) {
      return;
    }
    const isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
    if (isMobile) {
      setChannelsHidden(true);
    }
  }, []);

  useEffect(() => {
    if (channel) {
      setChannelId(channel);
    } else if (channelId) {
      router.push({ pathname: '/app/chat', query: { c: channelId } });
    }
  }, [channel]);
  if (channelsLoading) {
  }
  return (
    <>
      <Head>
        <title>Spark</title>
        <meta name="description" content="A chat app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col h-screen max-h-screen w-full bg-zinc-800">
        <Header currentPage='/app/chat' />
				<FaBars onClick={() => setChannelsHidden(!channelsHidden)} className="mt-3 ml-3 text-2xl hover:text-purple-600" />
        <div className={`flex h-full gap-3 p-3`}>
				{channelsHidden ? (
              <></>
            ) : (  
          <div className="absolute z-50 flex flex-col bg-zinc-700 gap-3 p-3 rounded-md">
                {channels?.map((channel) => (
                  <div
                    className={[
                      'text-sm rounded-md p-2 hover:bg-neutral-300 dark:hover:bg-zinc-600 hover:text-purple-600 hover:cursor-pointer',
                      channelId == channel.id ? ' bg-neutral-300 dark:bg-zinc-600' : '',
                    ].join(' ')}
                    key={channel.id}
                    onClick={() => {
                      setChannelId(channel.id);
                      router.push({ pathname: '/app/chat', query: { c: channel.id } });
                    }}
                  >
                    <i>#{channel.name}</i>
                  </div>
                ))}
          </div>)}
          {channelId ? (
            <ChatBox channelId={channelId} compact={true} />
          ) : (
            <div className="mx-auto my-auto text-4xl w-full text-center text-zinc-600">
              No channel selected
            </div>
          )}
        </div>
      </div>
    </>
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
