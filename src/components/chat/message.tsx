import React, { FC, useState } from 'react';
import {
  FaCommentSlash,
  FaPen,
  FaPenFancy,
  FaPenSquare,
  FaReply,
  FaTrashAlt,
} from 'react-icons/fa';
import { trpc } from '../../utils/trpc';
import { LinkElement } from './embeds/linkElement';
import superjson from 'superjson';
import { MessageElement, URLEmbedElement } from '../../utils/messageParser';
import { MessageUserDisplay } from '../messageUserDisplay';
import { Message, User } from '@prisma/client';
import defaultCss from '../../utils/defaultCss';

type Props = {
  message: Message & { user: User };
};

const MessageComponent: FC<Props> = ({ message }) => {
  const [actionsHidden, setActionsHidden] = useState(true);

  if (!message) {
    return <></>;
  }

  const renderMessage = (message: Message) => {
    const messageElements = superjson.parse<MessageElement[]>(message.content);
    const JSXElements = [];
    JSXElements.push(
      messageElements.map((elem, i) => {
        if (elem.type === 'text') {
          return (
            <p key={message.id + i} className="whitespace-pre-wrap inline">
              {elem.content}
            </p>
          );
        } else if (elem.type === 'url') {
          return (
            <a href={elem.content} target="_blank" className={`${defaultCss.link} inline-block`}>
              {elem.content}
            </a>
          );
        }
      })
    );
    return JSXElements;
  };

  const deleteMutation = trpc.message.delete.useMutation();

  const handleDeleteClick = () => {
    deleteMutation.mutate({ channelId: message.channelId, messageId: message.id });
  };

	const handlePointer = () => {
		const isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
		if(isMobile) {
			return;
		}

		setActionsHidden(!actionsHidden)
	}

  return (
    <div
      className="flex w-full gap-2 hover:dark:bg-zinc-700 py-1 px-3 group text-sm rounded-md rounded-tr-none"
      onPointerEnter={() => handlePointer()}
      onPointerLeave={() => handlePointer()}
			onTouchStart={() => setActionsHidden(!actionsHidden)}
    >
      <div className="flex items-center h-max gap-1">
        <div className="dark:text-zinc-400 text-right w-16">
          {new Date(Number(message.timestamp)).toLocaleTimeString()}
        </div>
        <MessageUserDisplay user={message.user} />
      </div>
      <div className="flex-1">{renderMessage(message)}</div>
      <div className="relative -mr-3">
        <div
          className={`${
            actionsHidden ? 'invisible' : 'visible'
          } flex gap-2 absolute -top-8 right-0 p-2 bg-zinc-700 rounded-t-md text-md z-50`}
        >
          {/* <div className="flex gap-1 flex-1">{message.content}</div> */}
          <div className="hover:text-purple-600">
            <FaReply />
          </div>
          <div className="hover:text-purple-600">
            <FaPen />
          </div>
          <div className="hover:text-purple-600" onClick={handleDeleteClick}>
            <FaTrashAlt />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
