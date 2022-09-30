import isUrl from "is-url"

export const openGraph = async (url: string) => {
	if(!isUrl(url)) {
		return { error: 'Valid URL not supplied'}
	}
	let markup = '';
	const text = (r: Response) => r.text();
	await fetch(url).then(response => console.log(response.text()));
	return {data:''};
}