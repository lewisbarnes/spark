import React, { FC } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { trpc } from '../utils/trpc';
import { LinkEmbed } from './modal/embeds/linkEmbed';
import superjson from 'superjson';
import { MessageElement, URLEmbedElement } from '../utils/messageParser';

type Props = {
	message: string;
	messageId: string;
	channelId: string;
};

const ProcessedMessage: FC<Props> = ({ message, messageId, channelId }) => {
	if (!message) {
		return <></>;
	}

	function isURL(content: string | URLEmbedElement): content is URLEmbedElement {
		return (content as URLEmbedElement).url !== undefined;
	}

	const renderMessage = (message: string) => {
		const messageElements = superjson.parse<MessageElement[]>(message);
		const JSXElements = [];
		JSXElements.push(messageElements.map((elem,i) => {
			if (elem.type === 'text' && typeof elem.content === 'string') {
				return <p key={messageId + i} className="text-wrap">{elem.content as string}</p>
			} else if (elem.type === 'url' && isURL(elem.content)) {
					return <LinkEmbed key={messageId + i} url={elem.content.url} title={elem.content.title}/>
			}}));
		return JSXElements;
	};

	const deleteMutation = trpc.useMutation(['message.delete'], {
		onSuccess() {
			utils.invalidateQueries(['message.getByChannelId']);
		},
	});
	const utils = trpc.useContext();
	
	const handleDeleteClick = () => {
		deleteMutation.mutate({ channelId: channelId, messageId: messageId });
	};

	return (
		<div className="flex flex-grow mr-2 group relative">
			<div className="flex flex-col gap-1">
				{renderMessage(message)}
			</div>
			<div className="flex-grow"></div>
			<div className="hidden group-hover:block my-auto" onClick={handleDeleteClick}>
				<FaTrashAlt />
			</div>
		</div>
	);
};

export default ProcessedMessage;
