import { useEffect, useState } from 'react';

export type Route =
  | { name: 'onboarding' }
  | { name: 'planner' }
  | { name: 'source'; itemId: string };

export function readRoute(hash = window.location.hash): Route {
  if (hash === '#/planner') {
    return { name: 'planner' };
  }

  const sourceMatch = /^#\/sources\/([^/]+)$/.exec(hash);
  if (sourceMatch?.[1]) {
    return { name: 'source', itemId: decodeURIComponent(sourceMatch[1]) };
  }

  return { name: 'onboarding' };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => readRoute());

  useEffect(() => {
    const handleHashChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return route;
}

export function navigate(path: string): void {
  window.location.hash = path;
}
