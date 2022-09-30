import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import ToolTip from './tooltip';

const UserList: React.FC = () => {
  const [showTooltip, setShowToolTip] = useState(false);
  const { data: session } = useSession();
  const [toolTipPos, setToolTipPos] = useState({
    clientY: 0,
    clientX: 0,
  });
  return (
    <div className="scrollbar-thin max-h-[93.8vh] space-y-2 overflow-y-auto border-l bg-zinc-800 pl-2 dark:border-zinc-600 md:static md:z-0">
      <FaUser className="mx-auto mb-3" />
      {Array.from([1]).map((x, i) => (
        <div
          className="relative"
          onMouseEnter={(e) => {
            setShowToolTip(true);
            setToolTipPos({
              clientY:
                e.currentTarget.getBoundingClientRect().y +
                e.currentTarget.getBoundingClientRect().height / 4,
              clientX: e.currentTarget.getBoundingClientRect().x,
            });
          }}
          onMouseLeave={() => setShowToolTip(false)}
        >
          <img
            src={session?.user?.image!}
            className="aspect-square h-8 rounded-full"
            draggable={false}
          ></img>
          <div className="absolute bottom-0 left-0 z-30 rounded-full border-2 border-zinc-800 bg-green-400 p-1"></div>
          {showTooltip && (
            <ToolTip
              value={session?.user?.name!}
              pos={{ x: toolTipPos.clientX - 16 * 10, y: toolTipPos.clientY }}
            ></ToolTip>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserList;
