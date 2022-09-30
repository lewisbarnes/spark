import { Message, User } from '@prisma/client';
import Link from 'next/link';
import React, { FC, useMemo, useState } from 'react';
import { FaPen, FaPlay, FaReply, FaTrashAlt } from 'react-icons/fa';
import superjson from 'superjson';
import { MessageElement } from '../../utils/messageParser';
import { trpc } from '../../utils/trpc';
import Portal from '../portal';

type Props = {
  message: Message & { user: User };
};

const StandardText: FC<{ text: string }> = ({ text }) => {
  return <p className="inline whitespace-pre-wrap">{text}</p>;
};

const StandardLink: FC<{ caption: string; href: string }> = ({ caption, href }) => {
  return (
    <a
      href={href}
      target="_blank"
      className="text-blue-600 hover:cursor-pointer hover:underline dark:text-blue-400"
    >
      {caption}
    </a>
  );
};

const YoutubeEmbed: FC<{ caption: string; href: string }> = ({ caption, href }) => {
  const [showVideo, setShowVideo] = useState(false);

  if (!href.startsWith('https://youtu.be/') && !href.startsWith('https://www.youtube.com/watch')) {
    return (
      <Link href={href}>
        <a
          target="_blank"
          className="text-blue-600 hover:cursor-pointer hover:underline dark:text-blue-400"
        >
          {caption}
        </a>
      </Link>
    );
  }
  let ytURL = new URL(href);
  let videoSlug = '';
  console.log(ytURL.pathname);
  if (ytURL.pathname == '/watch') {
    videoSlug = ytURL.searchParams.get('v')!;
  } else {
    videoSlug = ytURL.pathname;
  }
  return (
    <div className="relative w-[70%] md:w-[30rem]">
      <img
        src={`https://img.youtube.com/vi/${videoSlug}/maxresdefault.jpg`}
        className={`aspect-video w-full rounded-xl`}
      ></img>
      <button
        className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center rounded-md border border-zinc-600 bg-zinc-800/90 text-center"
        onClick={() => setShowVideo(true)}
      >
        <p className="absolute bottom-2 left-2 rounded-md border border-zinc-600 bg-zinc-800 p-1 text-xs">
          YouTube Video
        </p>
        <Link href={`https://youtu.be/${videoSlug}`}>
          <a
            className="absolute top-2 left-2 right-2 break-all rounded-md border border-zinc-600 bg-zinc-800 p-1 text-xs text-blue-400 hover:underline"
            target="_blank"
          >
            {`https://youtu.be/${videoSlug}`}
          </a>
        </Link>
        <div className="rounded-md border border-zinc-600 bg-zinc-800 p-2">
          <FaPlay />
        </div>
      </button>
      {showVideo && (
        <Portal>
          <div
            className="pointer-events-auto absolute left-0 right-0 top-0 bottom-0 z-50 flex select-none flex-col items-center justify-center bg-zinc-800/80 backdrop-blur"
            onClick={() => setShowVideo(false)}
          >
            {/* <button className="mb-8" onClick={() => setShowVideo(false)}>
              <FaWindowClose className="mx-auto rounded-md text-xl" />
            </button> */}
            <p className="-mt-8 mb-8">Click the background to exit</p>
            <iframe
              src={`https://www.youtube.com/embed/${videoSlug.replace('/', '')}?autoplay=1`}
              title="YouTube Video Embed"
              allowFullScreen={true}
              className={`mx-auto aspect-video w-[95vw] select-none rounded-md md:w-[70vw]`}
            ></iframe>
          </div>
        </Portal>
      )}
    </div>
  );
};

const renderMessage: React.FC<Message & { user: User }> = (message) => {
  const messageTokens = superjson.parse<MessageElement[]>(message.content);
  const messageElements: React.ReactNode[] = [];
  const messageEmbeds: React.ReactNode[] = [];
  messageTokens.map((elem, i) => {
    if (elem.type === 'text') {
      messageElements.push(<StandardText key={message.id + i} text={elem.content} />);
    } else if (elem.type === 'url') {
      if (
        elem.content.startsWith('https://youtu.be/') ||
        elem.content.startsWith('https://www.youtube.com/watch')
      ) {
        messageEmbeds.push(<YoutubeEmbed href={elem.content} caption={elem.content} />);
      } else {
        messageElements.push(<StandardLink href={elem.content} caption={elem.content} />);
      }
    } else if (elem.type === 'whitespace') {
      messageElements.push(<StandardText key={message.id + i} text={elem.content} />);
    }
  });
  return <>{[...messageElements, ...messageEmbeds]}</>;
};

const MessageComponent: FC<Props> = ({ message }) => {
  const [actionsHidden, setActionsHidden] = useState(true);
  const renderedMessage = useMemo(() => renderMessage(message), [message.content]);

  const deleteMutation = trpc.message.delete.useMutation();

  const handleDeleteClick = () => {
    deleteMutation.mutate({ channelId: message.channelId, messageId: message.id });
  };

  const handlePointer = () => {
    const isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
    if (isMobile) {
      return;
    }

    setActionsHidden(!actionsHidden);
  };

  const getMessageTimeStamp = (timestamp: bigint) => {
    return new Date(Number(timestamp)).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="group flex w-full gap-2 rounded-md border border-transparent py-3 px-3 text-sm hover:border-zinc-600">
      <div className="flex-1">
        <span className="text-purple-600 dark:text-purple-400">
          <span className="text-[8px] dark:text-zinc-400">
            {getMessageTimeStamp(message.timestamp!)}
          </span>{' '}
          <span className="hover:underline">{message.user.name!}</span>
        </span>{' '}
        {renderedMessage}
      </div>
      <div className="invisible relative -mr-3 group-hover:visible">
        <div className="text-md absolute -top-6 right-3 z-40 flex gap-2 rounded-md border border-zinc-600 bg-neutral-300 p-2 dark:bg-zinc-800 hover:[&>button]:text-purple-400">
          <button>
            <FaReply />
          </button>
          <button>
            <FaPen />
          </button>
          <button onClick={handleDeleteClick}>
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
