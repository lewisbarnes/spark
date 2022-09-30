import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaBolt, FaCog, FaPooStorm } from 'react-icons/fa';
import ToolTip from './tooltip';
import { UserDisplay } from './userDisplay';

const navLinks = [
  {
    caption: 'Chat',
    href: '/app/chat',
  },
  {
    caption: 'Messages',
    href: '/app/messages',
  },
  {
    caption: 'Settings',
    href: '/app/settings',
  },
  {
    caption: 'About',
    href: '/app/about',
  },
];

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  return (
    <div className="flex w-full items-center gap-2 py-2">
      <Link href="/app">
        <a className="ml-2 rounded-full border-2 p-1">
          <FaPooStorm />
        </a>
      </Link>
      {navLinks.map((link) => (
        <Link href={link.href}>
          <a
            className={`rounded-md p-1 px-2 text-sm hover:bg-zinc-600 hover:text-purple-400 ${
              router.pathname.includes(link.href) && 'bg-purple-400'
            }`}
          >
            {link.caption}
          </a>
        </Link>
      ))}
      <div className="flex-grow"></div>
      <div className="flex gap-1 rounded-md p-1 text-sm">
        {status == 'authenticated' && <UserDisplay user={session?.user!} />}
      </div>
    </div>
  );
};

export default Header;
