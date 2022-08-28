import Link from 'next/link';
import Image from 'next/image';
import React, { FC } from 'react';
import { emoteMap } from '../utils/emoteMap';
import { trpc } from '../utils/trpc';
import ogs from 'ts-open-graph-scraper';
import { FaTrashAlt } from 'react-icons/fa';
import { LinkEmbed } from './modal/embeds/linkEmbed';
import MessageParser from '../utils/messageParser';
import FormatMessage from '../utils/messageFormatter';

type Props = {
	compact: boolean;
	message: string;
	messageId: string;
	channelId: string;
};

const urlRE =
	/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

const ProcessedMessage: FC<Props> = ({ message, compact, messageId, channelId }) => {
	if (!message) {
		return <></>;
	}

	
	let splitMessage = message.split(' ');
	let messageElements = new Array<React.ReactNode>();
	let builtString = '';
	const deleteMutation = trpc.useMutation(['message.delete'], {
		onSuccess(data) {
			utils.invalidateQueries(['message.getByChannelId']);
		},
	});
	const utils = trpc.useContext();
	const handleDeleteClick = (event: React.MouseEvent) => {
		deleteMutation.mutate({channelId: channelId, messageId: messageId});
	};
	const parsedMessage = MessageParser(message);
	if(parsedMessage.elements.length == 0) {
		return <></>;
	}
	return (
		<div className="flex flex-grow mr-2  group" key={messageId}>
			<div className="flex flex-col gap-1" key={messageId}>{FormatMessage(message)}</div>
			<div className='flex-grow'></div>
			<div className="hidden group-hover:block my-auto" onClick={handleDeleteClick}>
				<FaTrashAlt />
			</div>
		</div>
	);
};

export default ProcessedMessage;
