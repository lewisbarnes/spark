import { FC } from "react"

type Props = {
	children: JSX.Element;
}

export const ModalContainer: FC<Props> = ({ children }) => {
	return (
		<div className=" container opacity-100 mx-auto mt-12 rounded-md">
			{children}
		</div>
	)
}