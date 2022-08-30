import { FC, MouseEventHandler } from "react";

type Props = {
	onClick: MouseEventHandler;
	children: JSX.Element;
}
export const ModalLayout: FC<Props> = ({ onClick, children }) => {
	return (
		<div className="fixed top-0 left-0 h-screen w-screen z-30 backdrop-blur" onClick={onClick}>
			{children}
		</div>
	);
}