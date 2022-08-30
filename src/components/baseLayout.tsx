import { FC } from 'react';

type Props = {
	children: JSX.Element;
};
export const BaseLayout: FC<Props> = ({ children }) => {
	return (
		<main className="min-h-screen min-w-screen bg-[url('https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg')] bg-no-repeat bg-cover bg-center">
			{children}
		</main>
	);
};
