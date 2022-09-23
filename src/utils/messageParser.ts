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
  content: string;
};

const MessageParser = (message: string) => {
  const elements = ParseMessage(message, []);
  let runningWords = '';
  const reducedElements = [];
  for (const element of elements) {
    if (element.type !== 'word') {
			if (runningWords.length > 0) {
        reducedElements.push({ type: 'text', content: runningWords});
        runningWords = '';
      }
      reducedElements.push(element);

    } else {
      runningWords += element.content;
    }
  }
  if (runningWords.length > 0) {
    reducedElements.push({ type: 'text', content: runningWords});
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
    if (!char.includes(' ') && !char.includes('\n')) {
      runningTokens += char;
      if (message.charAt(i + 1) === ' ' || message.charAt(i + 1) === '\n'  || i + 1 === message.length) {
        if (isUrl(runningTokens)) {
          elements.push({
            type: 'url',
            content: runningTokens,
          });
          runningTokens = '';
        }
      }
    } else {
			runningTokens += char;
      elements.push({ type: 'word', content: runningTokens });
      runningTokens = '';
    }
  }
  if (runningTokens !== '') {
    elements.push({ type: 'word', content: runningTokens });
  }
  return elements;
};

export default MessageParser;
