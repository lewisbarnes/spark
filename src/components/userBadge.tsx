import { FC } from 'react';
import { IconType } from 'react-icons';
import { FaTools, FaIdBadge, FaDiscord, FaGlobeAmericas } from 'react-icons/fa';
import { TiFlash } from 'react-icons/ti';

type Badge = {
	badge: JSX.Element;
	desc: string;
}

const badges: {[id: string] : Badge} =  {
	"dev": {badge: <TiFlash/>, desc: "Developer"},
	"admin": {badge: <FaIdBadge/>, desc: "Global Admin"},
	"discord": {badge: <FaDiscord/>, desc:"Discord User"},
	"globe": {badge: <FaGlobeAmericas/>, desc:"Email User"}
}

export const UserBadge: FC<{badgeName: string}> = ({ badgeName }) => {
		return (
			<div className="group relative">
				{badges[badgeName]?.badge}
				<p className="hidden group-hover:block fixed z-50 mt-1 text-white bg-purple-500 px-2 rounded-md">
				{badges[badgeName]?.desc}
				</p>
			</div>
		);
};
