import 'ress';
import '@/shared/styles/global.css';
import { MantineProvider } from '@mantine/core';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { AppProps } from 'next/app';
import { Noto_Sans_JP as fontNotoSansJP } from 'next/font/google';
import { useState } from 'react';
import { SWRConfig } from 'swr';
import { fetcher } from '@/features/swr/fetcher';
import { GoogleTagManagerBody } from '@/shared/components/GoogleTagManager';

const font = fontNotoSansJP({
  weight: ['400', '600'],
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  preload: true,
});

function MyApp({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <>
      <GoogleTagManagerBody />
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
          breakpoints: {
            xs: '360px',
            sm: '540px',
            md: '720px',
            lg: '1080px',
            xl: '1200px',
          },
          fontFamily: font.style.fontFamily,
        }}
      >
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <SWRConfig value={{ fetcher }}>
            <Component {...pageProps} />
          </SWRConfig>
        </SessionContextProvider>
      </MantineProvider>
    </>
  );
}

export default MyApp;
