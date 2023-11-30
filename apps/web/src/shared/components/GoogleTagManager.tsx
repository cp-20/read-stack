import Script from 'next/script';
import type { FC } from 'react';

interface GoogleTagManagerProps {
  nonce: string;
}

const id = process.env.NEXT_PUBLIC_GTM_ID;

export const GoogleTagManager: FC<GoogleTagManagerProps> = ({ nonce }) => {
  if (!id) return null;

  return (
    <Script
      dangerouslySetInnerHTML={{
        __html: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${id}');
      `,
      }}
      id="gtm"
      nonce={nonce}
      strategy="afterInteractive"
    />
  );
};

export const GoogleTagManagerBody: FC = () => {
  if (!id) return null;

  return (
    <noscript>
      <iframe
        height="0"
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
        width="0"
      />
    </noscript>
  );
};
