import { AuthButtons } from './authButtons';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { UserDisplay } from './userDisplay';
import { TiFlash } from 'react-icons/ti';
import { IconContext } from 'react-icons';
import Link from 'next/link';
export const NavBar = () => {
	const { data: session } = useSession();

	return (
		<div className="flex flex-col">
			<Link href="/">
					<div className="mx-auto bg-teal-600 rounded-full hover:bg-teal-800 hover:cursor-pointer">
						<IconContext.Provider value={{ className: 'my-auto fill-white ', size: '32px' }}>
							<TiFlash />
						</IconContext.Provider>
					</div>
			</Link>
			<div className="flex justify-between">
				<Link href={`/user/settings`}>
					<div className="py-1 px-2 rounded-full hover:cursor-pointer">
						{session?.user ? (
							<UserDisplay
								user={session.user!}
								compact={false}
							/>
						) : (
							<></>
						)}
					</div>
				</Link>
				<AuthButtons />
			</div>
		</div>
	);
};
