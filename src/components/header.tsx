import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaCog } from 'react-icons/fa';
import { UserDisplay } from './userDisplay';

const navLinks = [
  {
    caption: 'chat',
    href: '/app/chat',
  },
  {
    caption: 'kanban',
    href: '/app/kanban',
  },
];

const Header: React.FC<{ currentPage: string }> = ({ currentPage }) => {
  const { data: session } = useSession();

  return (
    <>
      <div className="p-3 bg-neutral-300 dark:bg-zinc-700 drop-shadow-md flex justify-between">
        <Link href="/app" className="self-start ">
          <div className="font-bold text-2xl hover:cursor-pointer">Spark</div>
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
      <div className="flex gap-3 px-3 py-1">
        {navLinks.map((link) => (
          <div className={`border-b-2 px-1 ${link.href == currentPage ? 'border-purple-600' : ''}`}>
            <Link href={link.href}>{link.caption}</Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Header;
