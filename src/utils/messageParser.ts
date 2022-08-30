import isUrl from 'is-url';
import { OGImage } from 'ts-open-graph-scraper';

export type URLEmbedElement = {
	url: string;
	title: string;
	desc: string;
	image: OGImage | OGImage[] | null;
};

export type MessageElement = {
	type: string;
	content: string | URLEmbedElement;
};

const MessageParser = (message: string) => {
	const elements = ParseMessage(message, []);
	let runningWords = '';
	const reducedElements = [];
	for (const element of elements) {
		if (element.type === 'word') {
			runningWords += element.content + ' ';
		} else {
			if (runningWords.length > 0) {
				reducedElements.push({ type: 'text', content: runningWords.trim() });
				runningWords = '';
			}
			reducedElements.push(element);
		}
	}
	if (runningWords.length > 0) {
		reducedElements.push({ type: 'text', content: runningWords.trim() });
		runningWords = '';
	}
	return reducedElements;
};

const tryMatchURL = (input: string) => {
	if (isUrl(input)) {
		return {
			result: true,
			element: { type: 'url', content: { url: input, title: input, desc: '', image: null } },
		};
	}
	return { result: false, element: null };
};

const ParseMessage = (message: string, elements: MessageElement[]) => {
	let runningTokens = '';
	for (let i = 0; i < message.length; i++) {
		const char = message.charAt(i);
		if (i !== message.length - 1 && char !== ' ') {
			runningTokens += char;
		} else {
			runningTokens += char;
			const urlMatch = tryMatchURL(runningTokens);
			if (urlMatch.result) {
				if (urlMatch.element !== null) {
					elements.push(urlMatch.element);
					runningTokens = '';
				}
			} else {
				if (char === ' ') {
					elements.push({ type: 'word', content: runningTokens.trim() });
					runningTokens = '';
				}
			}
			if (i + 1 < message.length) {
				ParseMessage(message.slice(i + 1), elements);
				break;
			}
		}
	}
	if (runningTokens !== '') {
		elements.push({ type: 'word', content: runningTokens });
	}
	return elements;
};

export default MessageParser;
