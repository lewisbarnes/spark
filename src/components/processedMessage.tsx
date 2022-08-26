import Link from 'next/link';
import Image from 'next/image';
import React, { FC } from 'react';
import { emoteMap } from '../utils/emoteMap';
import { trpc } from '../utils/trpc';
import ogs from 'ts-open-graph-scraper';
import { FaTrashAlt } from 'react-icons/fa';
import { LinkEmbed } from './modal/embeds/linkEmbed';

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
	let messageElements = new Array<JSX.Element>();
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

	splitMessage.forEach((token, i) => {
		if (urlRE.test(token)) {
			if (builtString.length > 0) {
				messageElements.push(
					<p className={`${!compact && 'leading-[32px] mr-1'} whitespace-pre-wrap`} key={messageId + i}>
						{builtString}
					</p>
				);
				builtString = '';
			}
			messageElements.push(
				<LinkEmbed url={token} key = {messageId + i}/>
				);
		} else if (emoteMap[token]) {
			if (builtString.length > 0) {
				messageElements.push(
					<p className={`${!compact && 'leading-[32px] mr-1'} whitespace-pre-wrap`} key = {messageId + i}>
						{builtString}
					</p>
				);
				builtString = '';
			}
			messageElements.push(<img src={emoteMap[token]!} width={16} height={16} key = {messageId + i}/>);
		} else {
			builtString += `${token} `;
		}
	});
	if (builtString.length > 0) {
		messageElements.push(
			<p className={`${!compact && 'leading-[32px] mr-1'} whitespace-pre-wrap`} key = {messageId + 'end'}>{builtString}</p>
		);
		builtString = '';
	}

	return (
		<div className="flex flex-grow mr-2  group" key={messageId}>
			<div className="flex flex-col gap-1" key={messageId}>{messageElements}</div>
			<div className='flex-grow'></div>
			<div className="hidden group-hover:block my-auto" onClick={handleDeleteClick}>
				<FaTrashAlt />
			</div>
		</div>
	);
};

export default ProcessedMessage;
