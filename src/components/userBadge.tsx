import { FC } from 'react';
import { FaTools, FaIdBadge } from 'react-icons/fa';
import { TiFlash } from 'react-icons/ti';

type Props = {
	badgeName: string;
};

export const UserBadge: FC<Props> = ({ badgeName }) => {
	if (badgeName == 'dev') {
		return (
			<div className="group">
				<TiFlash />
				<p className="hidden group-hover:block fixed z-50 mt-1 text-white bg-teal-600 px-2 rounded-md">
					Developer
				</p>
			</div>
		);
	} else {
		return (
			<div className="group relative">
				<FaIdBadge />
				<p className="hidden group-hover:block fixed z-50 mt-1 text-white bg-teal-600 px-2 rounded-md">
					Global Admin
				</p>
			</div>
		);
	}
};
