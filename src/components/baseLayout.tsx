import { FC } from 'react';
import Header from './header';

type Props = {
  children: React.ReactNode;
};
export const BaseLayout: FC<Props> = ({ children }) => {
  return (
    <main className="flex h-screen min-h-screen w-full flex-col bg-zinc-800 px-3">{children}</main>
  );
};
