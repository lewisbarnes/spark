import { NextPage, NextPageContext } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { ChatBox } from '../../components/chat/chatBox';
import Header from '../../components/header';
import { UserDisplay } from '../../components/userDisplay';
import { trpc } from '../../utils/trpc';

const AppHome: NextPage<{ channel: string }> = ({ channel }) => {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Spark</title>
        <meta name="description" content="A chat app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-screen max-h-screen w-full bg-white dark:bg-zinc-800 px-3">
        <Header />
        <div className="flex flex-col h-full justify-center gap-2">
          <p className="mx-auto text-4xl text-zinc-600">Welcome, {session!.user?.name!}!</p>
          <p className="mx-auto text-2xl text-zinc-600 text-center">
            Spark is in early development, there may be bugs.
          </p>{' '}
          <p className="mx-auto text-zinc-600 text-2xl">
            Why not try{' '}
            <Link href="/app/chat">
              <a className="text-purple-400">Chat</a>
            </Link>
            ?
          </p>
        </div>
      </div>
    </>
  );
};

export default AppHome;
