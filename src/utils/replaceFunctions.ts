

export const replaceImg = (srcURL: string) => {
	return `img:"${srcURL}" `;
}

export const replaceNbsp = (content: string) => {
	return ' ';
}

export const replaceURL = (content: string) => {
	console.log(content);
	return ` linkEmbed:"${content}" `;
}