import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaCog } from 'react-icons/fa';
import { UserDisplay } from './userDisplay';

const navLinks = [
  {
    caption: 'Chat',
    href: '/app/chat',
  },
];

const Header: React.FC = () => {
  const { data: session } = useSession();
	const router = useRouter();
  return (
    <div className="flex flex-col gap-1 bg-neutral-300  dark:bg-zinc-700 text-sm ">
      <div className=" dark:bg-zinc-700 flex justify-between p-2">
        <Link href="/app" className="self-start">
          <div className="font-bold text-md hover:cursor-pointer">Spark</div>
        </Link>
        <div className="flex gap-3">
          {session ? <UserDisplay user={session?.user!} /> : ''}
          <Link href="/app/settings">
            <div className="my-auto hover:text-purple-600">
              <FaCog />
            </div>
          </Link>
        </div>
      </div>
      <div className="flex p-2">
        {navLinks.map((link) => (
					<Link href={link.href}>
          <div className={`rounded-md px-3 text-center dark:bg-zinc-800 dark:hover:text-purple-400 hover:cursor-pointer ${link.href == router.pathname ? 'dark:text-purple-400' : ''}`}>
            {link.caption}
          </div>
					</Link>
        ))}
      </div>
    </div>
  );
};

export default Header;
