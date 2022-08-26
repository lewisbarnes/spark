import Link from "next/link";
import { FC } from "react";

type Props = {
	href: string;
	caption: string;
}

const LinkButton : FC<Props> = ({href, caption}) => {
	return (
		<Link href={href}>
		<div className="bg-zinc-600 px-2 my-auto rounded-full hover:cursor-pointer hover:bg-zinc-500">
			{caption}
		</div>
	</Link>
	)
}

export default LinkButton;