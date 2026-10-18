const KNOWN_ROUTES = ['calc', 'diary', 'diet', 'recipes', 'shopping', 'workout', 'sleep', 'foods', 'hub', 'changelog', 'developer'];

export function getBasePath(): string {
  if (typeof window === 'undefined') return '';
  const l = window.location;
  const isLocal = l.hostname === 'localhost' || l.hostname === '127.0.0.1' || l.hostname === '';
  if (isLocal) return '';
  const repo = l.pathname.split('/')[1];
  if (!repo || KNOWN_ROUTES.includes(repo)) {
    return '';
  }
  return '/' + repo;
}

export function getCurrentRelativePath(): string {
  if (typeof window === 'undefined') return '/';
  const l = window.location;
  const base = getBasePath();
  let pathname = l.pathname;
  if (base && pathname.startsWith(base)) {
    pathname = pathname.slice(base.length);
  }
  if (!pathname.startsWith('/')) {
    pathname = '/' + pathname;
  }
  return pathname === '' ? '/' : pathname;
}

export function navigateTo(path: string) {
  if (typeof window === 'undefined') return;
  const base = getBasePath();
  const cleanPath = path.startsWith('/') ? path : '/' + path;
  const fullPath = (base && cleanPath.startsWith(base)) ? cleanPath : base + cleanPath;
  window.history.pushState(null, '', fullPath);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
