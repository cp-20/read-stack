import Head from 'next/head';
import type { FC } from 'react';

const appUrl = '';

type DescriptionProps = {
  title: string;
  description: string;
  ogp?: string;
};

export const Description: FC<DescriptionProps> = ({
  title,
  description,
  ogp,
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta content={description} name="description" />

      {/* OGP */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={appUrl} />
      <meta property="og:site_name" content={title} />
      <meta property="og:locale" content="ja" />
      <meta property="og:image" content={ogp ?? `${appUrl}/ogp.png`} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@__cp20__" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogp ?? `${appUrl}/ogp.png`} />
    </Head>
  );
};
