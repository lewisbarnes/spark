import Image from 'next/image';
import { FC } from 'react';

type User = {
  id: string;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

export const UserDisplay: FC<{ user: User }> = ({ user }) => {
  return (
    <div className="flex gap-2 items-center text-sm">
      <Image className="rounded-full" src={user.image!} width="24" height="24"></Image>
      <p>{user.name!}</p>
    </div>
  );
};
