import { FC, useState } from 'react';
import defaultCss from '../../../utils/defaultCss';
import { ModalContainer } from '../modalContainer';
import { ModalLayout } from '../modalLayout';

export const LinkEmbed: FC<{
	url: string;
	title: string;
}> = ({ url, title }) => {
	const [showModal, setShowModal] = useState(false);
	const handleLinkClick = (e: React.MouseEvent) => {
		if (e.currentTarget !== e.target) {
			return;
		}
		setShowModal(!showModal);
	};
	return (
		<>
			{showModal && (
				<ModalLayout onClick={handleLinkClick}>
					<ModalContainer>
						<div className="flex flex-col gap-4 ">
							<p className="text-4xl text-center text-purple-400">WOAH!</p>
							<div className="text-center">
								<p>This link takes you to </p>
								<p className="text-blue-400">{url}</p>
								<p>Are you sure you want to continue?</p>
								<p>(It'll open in a new tab)</p>
							</div>
							<div className="self-center">
								<a href={url}>Yes, I&apos;m sure!</a>
							</div>
						</div>
					</ModalContainer>
				</ModalLayout>
			)}
			<p className={defaultCss.link + ' break-all'} onClick={handleLinkClick}>
				{title}
			</p>
		</>
	);
};
