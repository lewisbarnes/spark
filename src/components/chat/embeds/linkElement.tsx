import React from 'react';
import { FC, useState } from 'react';
import defaultCss from '../../../utils/defaultCss';
import { ModalContainer } from '../../modal/modalContainer';
import { ModalLayout } from '../../modal/modalLayout';

export const LinkElement: FC<{
  url: string;
}> = ({ url }) => {
  return (
    <a
      href={url}
      target="_blank"
      className={`${defaultCss.link} inline-block`}
    >
      {url}
    </a>
  );
};
