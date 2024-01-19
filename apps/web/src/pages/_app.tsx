import { fetcher } from '@/features/swr/fetcher';
import { GoogleTagManagerBody } from '@/shared/components/GoogleTagManager';
import '@/shared/styles/global.css';
import { MantineProvider } from '@mantine/core';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { AppProps } from 'next/app';
import localFont from 'next/font/local';
import { useMemo } from 'react';
import 'ress';
import { SWRConfig } from 'swr';

const font = localFont({
  src: './NotoSansJP-VariableFont_wght.ttf',
  preload: true,
});

const authCookieName = process.env.NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_NAME;

const MyApp = ({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session }>) => {
  const supabaseClient = useMemo(
    () =>
      createPagesBrowserClient({
        cookieOptions: authCookieName
          ? {
              name: authCookieName,
              secure: true,
              sameSite: 'Lax',
              domain: '',
              path: '/',
            }
          : undefined,
      }),
    [],
  );

  return (
    <>
      <GoogleTagManagerBody />
      <MantineProvider
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
          primaryColor: 'cyan',
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <SessionContextProvider
          initialSession={pageProps.initialSession}
          supabaseClient={supabaseClient}
        >
          <SWRConfig value={{ fetcher }}>
            <Component {...pageProps} />
          </SWRConfig>
        </SessionContextProvider>
      </MantineProvider>
    </>
  );
};

export default MyApp;
