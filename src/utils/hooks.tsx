import { User } from 'next-auth/core/types';
import Pusher from 'pusher-js';
import { useEffect } from 'react';
import { clientEnv } from '../env/schema.mjs';
import { trpc } from './trpc';

export const useMessageChannel = (channelId: string) => {
  const {
    data: messages,
    isLoading,
    refetch,
  } = trpc.message.getAllByChannelId.useQuery({ channelId: channelId });

  const { data: channel } = trpc.channel.getById.useQuery({ channelId: channelId });

  useEffect(() => {
    const pusher = new Pusher(clientEnv.NEXT_PUBLIC_PUSHER_KEY!, { cluster: 'eu' });
    const messageChannel = pusher
      .subscribe(channelId)
      .bind('new-message', function (data: { message: string; sender: User }) {
        refetch();
      })
      .bind(
        'message-deleted',
        function (data: { message: { content: string; id: string }; sender: User }) {
          refetch();
        }
      );
    return () => {
      messageChannel.unbind_all();
      messageChannel.unsubscribe();
      pusher.disconnect();
    };
  }, [messages]);

  return { channel, messages, isLoading };
};
