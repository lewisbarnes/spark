import { NextPage, NextPageContext } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FaBars, FaPlus } from 'react-icons/fa';
import { BaseLayout } from '../../../components/baseLayout';
import { ChatBox } from '../../../components/chat/chatBox';
import Header from '../../../components/header';
import { UserDisplay } from '../../../components/userDisplay';
import { trpc } from '../../../utils/trpc';

const KanbanHome: NextPage<{ channel: string }> = ({ channel }) => {
	const lanes = 'Backlog In-Progress Peer-Review In-Test Done Blocked'.split(' ');
  return (
    <>
      <Head>
        <title>Spark</title>
        <meta name="description" content="A chat app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col h-screen max-w-screen bg-zinc-800 overflow-auto">
        <Header currentPage="/app/kanban" />
        <div>
          <button className="bg-purple-600 m-3 px-3 rounded-md flex gap-3 items-center">
            New Item <FaPlus />
          </button>
        </div>
        <div className={`flex flex-col relative h-full max-w-screen overflow-auto`}>
					<div className='flex flex-1 min-w-screen'>
					{lanes.map(x => 
          <div className="w-1/6 min-w-[10rem] border-r-2 border-zinc-600">
            <p className="bg-zinc-700 p-2 sticky top-0">{x}</p>
					</div>)}
					</div>
        </div>
      </div>
    </>
  );
};

export default KanbanHome;
