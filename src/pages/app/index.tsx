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
  return (
    <>
      <Head>
        <title>Spark</title>
        <meta name="description" content="A chat app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col h-screen max-h-screen w-full bg-zinc-800">
        <Header currentPage='/app' />
				<p className='mx-auto my-auto text-4xl text-zinc-600'>Welcome to Spark!</p>
      </div>
    </>
  );
};

export default AppHome;
