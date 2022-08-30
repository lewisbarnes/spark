import { AuthButtons } from './authButtons';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FC } from 'react';
import { FaTools, FaCrown } from 'react-icons/fa';

type User = {
	id: string;
	name?: string | null | undefined;
	email?: string | null | undefined;
	image?: string | null | undefined;
};

type Props = {
	user: User;
	compact: boolean;
};

export const UserDisplay: FC<Props> = ({ user, compact }) => {
	return (
			<div className="flex gap-2 z-10">
				{!compact && (
					<div className="flex rounded-full w-[2rem] h-[2rem]">
						<Image
							className="rounded-full max-h-[2rem]"
							src={user.image!}
							width={32}
							height={32}
						></Image>
					</div>
				)}
				<span className={`${!compact ? 'leading-[32px]' : ''} align-middle`}>{user.name!}</span>
			</div>
	);
};
