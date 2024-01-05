import { ServerStyles, createStylesServer } from '@mantine/next';
import type { DocumentContext } from 'next/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { GoogleTagManager } from '@/shared/components/GoogleTagManager';
import { generateCsp } from '@/shared/lib/generateCsp';

const stylesServer = createStylesServer();

interface DocumentProps {
  csp: string;
  nonce: string;
}

export default class MyDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    // CSP (Cross Site Policy) と nonce (number used once) を生成 (XSS対策)
    const { csp, nonce } = generateCsp();

    return {
      ...initialProps,
      csp,
      nonce,
      styles: [
        initialProps.styles,
        <ServerStyles
          html={initialProps.html}
          key="styles"
          server={stylesServer}
        />,
      ],
    };
  }

  render() {
    const { csp, nonce } = this.props;
    return (
      <Html lang="ja">
        <Head nonce={nonce}>
          <meta content={csp} httpEquiv="Content-Security-Policy" />

          <GoogleTagManager nonce={nonce} />

          <link href="/favicon.ico" rel="icon" sizes="any" />
          <link href="/icon.svg" rel="icon" type="image/svg+xml" />
          <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
          <link href="/manifest.webmanifest" rel="manifest" />
        </Head>
        <body>
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}
