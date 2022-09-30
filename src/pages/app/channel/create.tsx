import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useState } from 'react';
import ActionButton from '../../../components/actionButton';
import { BaseLayout } from '../../../components/baseLayout';
import Header from '../../../components/header';
import { trpc } from '../../../utils/trpc';

const CreateChannel: NextPage = () => {
  const [channelName, setChannelName] = useState('');
  const [channelDesc, setChannelDesc] = useState('');
  const router = useRouter();

  const newChannel = trpc.channel.create.useMutation({
    onSettled(data) {
      router.push(`/app?channel=${data!.id!}`);
    },
  });

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setChannelName(event.target.value);
  };

  const handleChangeDesc = (event: ChangeEvent<HTMLInputElement>) => {
    setChannelDesc(event.target.value);
  };

  const handleSubmit = async (event: React.MouseEvent) => {
    await newChannel.mutateAsync({ name: channelName });
  };

  return (
    <div className="flex h-screen flex-col bg-neutral-200 dark:bg-zinc-800">
      <Header />
      <div className="absolute bottom-0 top-12 flex h-auto w-full flex-col bg-neutral-200 px-3 pb-3 pt-3 dark:bg-zinc-800">
        <p>Create Channel</p>
        <div className="flex">
          <div className="rounded-l-md bg-zinc-600 pl-2">
            <p className="p-1 text-2xl">#</p>
          </div>
          <input
            type="text"
            className="flex-grow rounded-r-md bg-zinc-600 p-2 focus:outline-none"
            placeholder="name your channel"
            onChange={handleChangeName}
            value={channelName}
          ></input>
        </div>
        <div className="self-center">
          <ActionButton action={handleSubmit} caption="Create" />
        </div>
      </div>
    </div>
  );
};

export default CreateChannel;
