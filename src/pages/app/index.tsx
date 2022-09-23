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
      <div className="flex flex-col h-screen max-h-screen w-full dark:bg-zinc-800">
        <Header/>
				<div className='flex flex-col h-full justify-center'>
				<p className='mx-auto text-4xl text-zinc-600'>Welcome to Spark!</p>
				<Link href="/app/chat"><p className='mx-auto text-2xl text-zinc-600'>Why not try <span className="hover:cursor-pointer text-purple-600 dark:text-purple-400">Chat</span>?</p></Link>
				</div>

      </div>
    </>
  );
};

export default AppHome;
