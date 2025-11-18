import { useEffect } from 'react';

interface NavigateProps {
  to: string;
}

export function Navigate({ to }: NavigateProps) {
  useEffect(() => {
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, [to]);

  return null;
}
