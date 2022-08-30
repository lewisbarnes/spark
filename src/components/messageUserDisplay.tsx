import Image from 'next/image';
import React, { FC, useState } from 'react';
import { UserBadge } from './userBadge';

type User = {
	id: string;
	name?: string | null | undefined;
	email?: string | null | undefined;
	image?: string | null | undefined;
};

type Props = {
	user: User;
};

export const MessageUserDisplay: FC<Props> = ({ user }) => {
	const [showProfile, setShowProfile] = useState(false);

	const toggleProfile = (event: React.MouseEvent) => {
		if (event.target == event.currentTarget) {
			setShowProfile(!showProfile);
		}
	};
	return (
		<div className="relative">
			<div className="flex gap-2 pl-1 z-10">
				<div className="flex my-auto gap-1">
				<UserBadge badgeName="dev" />
				</div>
				<span className="text-purple-700 dark:text-purple-400 " onClick={toggleProfile}>
					{user.name!}
				</span>
			</div>

			<div
				className={`${!showProfile ? 'hidden' : 'fixed'} h-full z-20 inset-0`}
				onClick={toggleProfile}
			></div>
			<div
				className={`${
					!showProfile ? 'hidden' : ''
				} flex flex-col gap-2 items-start bg-purple-400 dark:bg-black text-white absolute bottom-2 left-8 z-30 mx-2 rounded-md w-max h-max`}
			>
				<div className="flex gap-2 p-2 bg-purple-700 dark:bg-purple-500 rounded-t-md">
					<Image
						className="rounded-full max-w-[2rem] max-h-[2rem]"
						src={user.image ? user.image: ''}
						width={32}
						height={32}
					></Image>
					<p className="my-auto font-thin">{user.name}</p>
				</div>
				<div className="flex gap-2 px-2 pb-2">
					<UserBadge badgeName="dev" />
					<UserBadge badgeName="admin" />
					<UserBadge badgeName="discord" />
				</div>
			</div>
		</div>
	);
};
