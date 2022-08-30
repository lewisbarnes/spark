import { NextPage } from 'next';
import Link from 'next/link';
import defaultCss from '../utils/defaultCss';

const Playbook: NextPage = () => {
	return (
		<div className="h-screen flex flex-col gap-2">
			<div className="p-2 bg-zinc-800 drop-shadow-md">
				<Link href="/"><div className="font-bold text-2xl text-purple-400 hover:cursor-pointer">Spark</div></Link>
			</div>
			<div className="self-start mx-auto text-4xl">Playbook</div>
			<div className="self-start mx-auto text-2xl">Click elements to copy markup</div>
			<div className="self-start mx-auto text-xl">
					<div
						className={defaultCss.button + ' text-base'}
						onClick={() =>
							navigator.clipboard.writeText(
								`<ActionButton action={/* callback here */} caption="/* caption here */"/>`
							)
						}
					>
						Button
					</div>
			</div>
			<div className="self-start mx-auto text-xl">
					<div
						className={defaultCss.link + ' text-base'}
						onClick={() =>
							navigator.clipboard.writeText(
								`<Link href="/* URL here */">
									<div className="${defaultCss.link}">
										/* Link text here */
									</div>
								</Link>`
							)
						}
					>
						Link
					</div>
			</div>
		</div>
	);
};

export default Playbook;
