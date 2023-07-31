import 'ress';
import '@/shared/styles/global.css';
import { MantineProvider } from '@mantine/core';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { SWRConfig } from 'swr';
import { fetcher } from '@/features/swr/fetcher';
import { GoogleTagManagerBody } from '@/shared/components/GoogleTagManager';

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
            sm: '800px',
            md: '1000px',
            lg: '1200px',
            xl: '1400px',
          },
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
