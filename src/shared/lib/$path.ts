export const pagesPath = {
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash })
}

export type PagesPath = typeof pagesPath

export const staticPath = {
  _gitkeep: '/.gitkeep',
  apple_touch_icon_png: '/apple-touch-icon.png',
  favicon_ico: '/favicon.ico',
  icon_192_png: '/icon-192.png',
  icon_512_png: '/icon-512.png',
  icon_svg: '/icon.svg',
  manifest_webmanifest: '/manifest.webmanifest',
  ogp_png: '/ogp.png'
} as const

export type StaticPath = typeof staticPath
