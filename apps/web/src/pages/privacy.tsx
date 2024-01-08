import { css } from '@emotion/react';
import type { FC } from 'react';

const PrivacyPage: FC = () => (
  <div
    css={css`
      max-width: 1080px;
      padding: 20px;
      margin: 0 auto;
    `}
  >
    <h1
      css={css`
        margin: 32px 0;
      `}
    >
      プライバシーポリシー
    </h1>
    <div>メールアドレスとそれに紐づく記事の未読情報などが保管されています</div>
    <div>情報はSupabase上に安全に保存されています</div>
  </div>
);

export default PrivacyPage;
