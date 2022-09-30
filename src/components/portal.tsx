import { createPortal } from 'react-dom';

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (typeof document === 'undefined') {
    return <>{children}</>;
  }
  const element = document.getElementById('portal-root');
  return element ? createPortal(children, element) : null;
};

export default Portal;
