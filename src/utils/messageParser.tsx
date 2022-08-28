import React from 'react';
import { LinkEmbed } from '../components/modal/embeds/linkEmbed';
import { emoteMap } from './emoteMap';
import { trpc } from './trpc';

const MessageParser = (message: string) => {
	const urlRE =
		/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/g;
	const parse = (messageToParse: string) => {
		if(messageToParse.startsWith('!')) {
			let commandArgs = messageToParse.split(' ');
			let command = commandArgs.find(x => x.startsWith('!'));
			commandArgs = commandArgs.filter(x => x != command);
			if(command == "!theo") {
				return { isCommand: true, elements: new Array<React.ReactNode>(<LinkEmbed url={'https://www.youtube.com/c/TheoBrowne1017'}/>)};
			}
			return { isCommand: true, elements: new Array<React.ReactNode>(messageToParse)};
		}

		let tokens = messageToParse.split(' ');
		let textContent = '';
		let elements = new Array<React.ReactNode>();
		let inlineElements = new Array<React.ReactNode>();
		tokens.forEach((x, i) => {
			if (x.startsWith('linkEmbed')) {
				let url = x.replace('linkEmbed:"','');
				url = url.slice(0,url.length-1);
				if(textContent.length > 0) {
					inlineElements.push(<p className='whitespace-pre-wrap'>{textContent}</p>);
					textContent = '';
				}
				elements.push(<div className='flex gap-1'>{inlineElements}</div>);
				inlineElements = new Array<React.ReactNode>();
				elements.push(<LinkEmbed url={url}/>);
			} else if(emoteMap[x] !== undefined) {
					if(textContent.length > 0) {
						inlineElements.push(<p className='whitespace-pre-wrap'>{textContent}</p>);
						textContent = '';
					}
					inlineElements.push(<img src={emoteMap[x]} width="16px"></img>)
				} else {
				textContent += `${x} `;
			}
		});
		if(textContent.length > 0) {
			inlineElements.push(<p className='whitespace-pre-wrap'>{textContent}</p>);
			textContent = '';
		}
		if(inlineElements.length > 0) {

			elements.push(<div className='flex gap-1 w-[10rem]'>{inlineElements}</div>);
		}
		return { isCommand: false, elements: elements };
	};
	
	if(/(&lt;div&gt;{1})(.*)(&lt;\/div&gt;{1})/g.test(message)) {
		message = message.replaceAll(/(&lt;div&gt;{1})(.*)(&lt;\/div&gt;{1})/g, '$2');
		message = message.replaceAll('&lt;br&gt;','\n');
	}
	return parse(message);
};

export default MessageParser;
