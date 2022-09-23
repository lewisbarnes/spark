import { FC } from 'react';

type Props = {
	children: JSX.Element;
};
export const BaseLayout: FC<Props> = ({ children }) => {
	return (
		<main className='flex flex-col h-screen min-h-screen w-full  bg-zinc-800'>
			{children}
		</main>
	);
};
