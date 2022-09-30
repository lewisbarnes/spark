import { trpc } from '@/utils/trpc';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { BaseLayout } from '../../components/baseLayout';
import Header from '../../components/header';

const AppSettings: NextPage = () => {
  const { data: session } = useSession();
  const [username, setUsername] = useState(session!.user?.name!);

  return (
    <div className="flex h-screen flex-col bg-neutral-200 px-3 pb-3 dark:bg-zinc-800">
      <Header />
      <div className="flex h-full w-full gap-3">
        <div className="flex h-full w-max flex-col gap-1 rounded-md text-center">
          <div className="rounded-md">Account</div>
        </div>
        <div className="flex flex-1 flex-col gap-3 rounded-md">
          <p className="text-xl">Account Settings</p>
          <div className="flex items-center gap-3 rounded-md">
            <p className="text-md">Username</p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-md h-max w-[50%] rounded-md border border-zinc-600 bg-zinc-800 p-1"
            ></input>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;
