import Head from 'next/head';
import type { FC } from 'react';

const appUrl = 'https://read-stack.cp20.dev';

interface DescriptionProps {
  title: string;
  description: string;
  ogp?: string;
}

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
      <meta content={title} property="og:title" />
      <meta content={description} property="og:description" />
      <meta content="article" property="og:type" />
      <meta content={appUrl} property="og:url" />
      <meta content={title} property="og:site_name" />
      <meta content="ja" property="og:locale" />
      <meta content={ogp ?? `${appUrl}/ogp.png`} property="og:image" />

      {/* Twitter Card */}
      <meta content="summary_large_image" name="twitter:card" />
      <meta content="@__cp20__" name="twitter:site" />
      <meta content={title} name="twitter:title" />
      <meta content={description} name="twitter:description" />
      <meta content={ogp ?? `${appUrl}/ogp.png`} name="twitter:image" />
    </Head>
  );
};
