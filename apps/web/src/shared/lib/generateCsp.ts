// CSP対応
// 参考: https://zenn.dev/monicle/articles/aee4871b288264

import crypto from 'node:crypto';
import { v4 } from 'uuid';

interface CspTag {
  csp: string;
  nonce: string;
}

export const generateCsp = (): CspTag => {
  const hash = crypto.createHash('sha256');
  hash.update(v4());
  const nonce = hash.digest('base64');

  const isVercelPreview = process.env.VERCEL_ENV === 'preview';

  /**
   * Strict SCPを適用します
   * @see https://csp.withgoogle.com/docs/strict-csp.html
   */
  const csp = `
  script-src 'unsafe-eval' 'unsafe-inline' https: http: ${
    isVercelPreview
      ? `https://vercel.live/ https://vercel.com`
      : `'nonce-${nonce}' 'strict-dynamic'`
  };
  object-src 'none';
  base-uri 'none';
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  return {
    csp,
    nonce,
  };
};
