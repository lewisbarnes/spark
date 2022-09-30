import Portal from '../components/portal';
import type { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaDiscord, FaPooStorm } from 'react-icons/fa';
import ActionButton from '../components/actionButton';
import { BaseLayout } from '../components/baseLayout';
import { UserDisplay } from '../components/userDisplay';
import defaultCss from '../utils/defaultCss';

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const Home: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Spark</title>
        <meta name="description" content="A chat app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <div
          className="-mx-3 h-screen w-screen bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url('${'https://unsplash.com/photos/FQmeg_9K-Ck/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8NDh8fHNwYXJrfGVufDB8MHx8fDE2NjQ1NDY3NTY&force=true&w=1920'})`,
          }}
        >
          <div className="flex min-h-screen select-none flex-col items-center justify-center bg-purple-800/40 pt-2 backdrop-blur-sm backdrop-saturate-0">
            <div className="mx-auto w-60 rounded-t-md border border-b-0 border-zinc-600 bg-zinc-800 p-4 pb-2">
              <FaPooStorm className="mx-auto text-6xl" />
            </div>
            <p className="mx-auto w-60 border-x border-zinc-600 bg-zinc-800 p-2 text-center text-6xl ">
              Spark
            </p>
            <div className="w-60 self-center rounded-b-md border border-t-0 border-zinc-600 bg-zinc-800 px-2 pb-2 text-center">
              {session && (
                <div className="mt-4 flex flex-col gap-1">
                  <p className="pt-1 text-center">Signed in as</p>
                  <p className="mb-1">{session.user?.name}</p>
                  <Link href="/app/chat">
                    <a className="rounded-md border border-zinc-600 p-1 text-center hover:border-white">
                      Open App
                    </a>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="rounded-md border border-zinc-600 p-1 text-center hover:border-white"
                  >
                    Sign Out
                  </button>
                  {/* <ActionButton action={() => signOut()} caption="Sign Out" /> */}
                </div>
              )}
              {!session && (
                <div className="mt-2 flex flex-col gap-1">
                  <button
                    onClick={() => signIn('discord')}
                    className="rounded-md border border-zinc-600 p-1 text-center hover:border-white"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
            <Link href="https://i-am.lewisbarnes.dev/">
              <a className="absolute bottom-2 text-zinc-400">lewisbarnes.dev</a>
            </Link>
          </div>
        </div>
      </BaseLayout>
    </>
  );
};

export default Home;
