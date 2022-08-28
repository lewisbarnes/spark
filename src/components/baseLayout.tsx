import { FC } from 'react';
import { NavBar } from './navBar';

type Props = {
	children: JSX.Element;
};
export const BaseLayout: FC<Props> = ({ children }) => {
	return (
		<main className="container mx-auto flex flex-col min-h-screen pt-4 px-2">
			<NavBar />
			{children}
		</main>
	);
};
