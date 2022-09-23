import { NextPage } from 'next';
import { BaseLayout } from '../../components/baseLayout';
import Header from '../../components/header';

const AppSettings: NextPage = () => {
  return (
    <BaseLayout>
      <div className="h-full w-full relative flex flex-col">
        <Header />
        <div className="h-full w-full flex p-3 gap-3">
          <div className="bg-zinc-700 h-full w-max rounded-md flex flex-col gap-4 text-center p-3">
            <div className="bg-zinc-600 p-3 rounded-md">Account</div>
            <div className="p-3 rounded-md">Profile</div>
            <div className="p-3 rounded-md">Channels</div>
            <div className="p-3 rounded-md">Blocked Users</div>
          </div>
          <div className="flex-1 rounded-md flex flex-col gap-3 bg-zinc-700 p-3">
            <p className="text-xl">Account Settings</p>
            <div className="rounded-md gap-3 flex items-center">
              <p className="text-md">Username</p>
              <input type="text" className="text-md h-max w-[50%] rounded-md bg-zinc-800 focus:outline-none p-1">
              </input>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default AppSettings;
