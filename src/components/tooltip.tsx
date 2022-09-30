import Portal from './portal';

const ToolTip: React.FC<{
  value: string;
  pos: { x: number; y: number };
  type?: keyof React.ReactHTML;
}> = ({ value: text, pos, type = 'p' }) => {
  const ElemType = type;
  return (
    <Portal>
      <ElemType
        className="w-[10rem] overflow-hidden rounded-md border border-zinc-600 bg-zinc-800 p-1 text-center text-sm"
        style={{ position: 'absolute', left: `${pos.x / 16}rem`, top: `${pos.y}px`, zIndex: 40 }}
      >
        {text}
      </ElemType>
    </Portal>
  );
};

export default ToolTip;
