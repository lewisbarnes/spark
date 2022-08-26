import { prependOnceListener } from "process";
import { FC, JSXElementConstructor, MouseEventHandler } from "react";

type Props = {
	onClick: MouseEventHandler<HTMLDivElement>;
	children: JSX.Element;
}
export const ModalLayout: FC<Props> = ({ onClick, children }) => {
	return (
		<div className="fixed h-screen w-screen z-30 backdrop-blur" onClick={onClick}>
			{children}
		</div>
	);
}