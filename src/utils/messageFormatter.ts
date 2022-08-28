import { replaceImg, replaceNbsp, replaceURL } from "./replaceFunctions";

const regularExpressions = [
	/&lt;div&gt;{1}(.*)&lt;\/div&gt;{1}/g,
	/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/g,
	/<img src="(.*)" alt=".*">/g,
];

type ReplaceFunction = {
	regEx: RegExp;
	func: Function;
}

enum MessageElementType {
	Image = 1,
	URL,
	Emote
}

type MessageElement = { 
	type: MessageElementType;
	content: string;
}

const replaceFunctions: ReplaceFunction[] = [
	{
		regEx: /(&nbsp;)/g,
		func: replaceNbsp
	},
	{
		regEx: /<img src="(.*)"\s?(alt=".*")?>/g,
		func: replaceImg
	},
	{
		regEx: /[\s]*((((http|https){1}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*)))/g,
		func: replaceURL
	},

]

const FormatMessage = (messageContent: string) => {
	const messageElements: MessageElement[] = [];
	for(const repFunc of replaceFunctions) {
		const matches = messageContent.matchAll(repFunc.regEx);
		for(const match of matches) {
			messageContent = messageContent.replaceAll(match[0]!, repFunc.func(match[0]));
		}
		}
	console.log(messageElements);
	return messageContent;
};



export default FormatMessage;
