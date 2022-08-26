import Link from 'next/link';
import { FC } from 'react';
import { trpc } from '../../../utils/trpc';

export const LinkEmbed : FC<{url: string}> = ({url}) => {
	const { data: ogData, isLoading: ogLoading } = trpc.useQuery(
		['openGraph.scrape', { url: url }],
		{}
	);

	return (
		<div className="flex bg-zinc-700 p-2 gap-1 rounded-md max-w-[32rem] drop-shadow-md">
			<div className="flex flex-col">
				<p className="text-xs">{ogData?.siteName}</p>
				<Link href={!url.startsWith('http') ? `https://${url}` : url}>
					<a target="_blank" className="text-blue-400 hover:cursor-pointer mr-4">
						{url}
					</a>
				</Link>
				<div className="">{ogData?.desc?.substring(0, 100)}</div>
			</div>
			<img
				className="mb-auto"
				src={ogData?.image?.at(0)!.url}
				width="80"
				referrerPolicy="no-referrer"
			/>
		</div>
	);
};
