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
		<div className="">
				<span className="text-purple-700 dark:text-purple-600 inline">
					{user.name!}
				</span>
		</div>
	);
};
