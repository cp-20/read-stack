const buildSuffix = (url?: {query?: Record<string, string>, hash?: string}) => {
  const query = url?.query;
  const hash = url?.hash;
  if (!query && !hash) return '';
  const search = query ? `?${new URLSearchParams(query)}` : '';
  return `${search}${hash ? `#${hash}` : ''}`;
};

export const pagesPath = {
  "api_key": {
    $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/api-key' as const, hash: url?.hash })
  },
  "home": {
    $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/home' as const, hash: url?.hash })
  },
  "login": {
    $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/login' as const, hash: url?.hash })
  },
  "privacy": {
    $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/privacy' as const, hash: url?.hash })
  },
  "signup": {
    $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/signup' as const, hash: url?.hash })
  },
  $url: (url?: { hash?: string | undefined } | undefined) => ({ pathname: '/' as const, hash: url?.hash })
};

export type PagesPath = typeof pagesPath;

export const staticPath = {
  _gitkeep: '/.gitkeep',
  apple_touch_icon_png: '/apple-touch-icon.png',
  assets: {
    google_icon_png: '/assets/google-icon.png',
    no_inbox_items_png: '/assets/no-inbox-items.png',
    no_read_articles_png: '/assets/no-read-articles.png',
    no_reading_articles_png: '/assets/no-reading-articles.png',
    no_result_png: '/assets/no-result.png'
  },
  favicon_ico: '/favicon.ico',
  icon_192_png: '/icon-192.png',
  icon_512_png: '/icon-512.png',
  icon_svg: '/icon.svg',
  manifest_webmanifest: '/manifest.webmanifest',
  ogp_png: '/ogp.png'
} as const;

export type StaticPath = typeof staticPath;
