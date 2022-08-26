import { FC, MouseEventHandler } from "react";

type Props = {
	action: MouseEventHandler;
	caption: string;
}

const ActionButton : FC<Props> = ({action, caption}) => {
	return (
		<div className="bg-teal-600 px-2 my-auto rounded-full text-center hover:cursor-pointer hover:bg-teal-800" onClick={action}>
			{caption}
		</div>
	)
}

export default ActionButton