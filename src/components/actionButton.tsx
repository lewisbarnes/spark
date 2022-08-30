import { FC, MouseEventHandler } from "react";
import defaultCss from "../utils/defaultCss";

type Props = {
	action: MouseEventHandler;
	caption: string;
}

const ActionButton : FC<Props> = ({action, caption}) => {
	return (
		<div className={defaultCss.button} onClick={action}>
			{caption}
		</div>
	)
}

export default ActionButton