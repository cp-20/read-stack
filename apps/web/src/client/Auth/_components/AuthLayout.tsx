import { css } from '@emotion/react';
import type { FC, ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
};

export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        max-width: 540px;
        margin: 0 auto;
        padding: 64px 16px 0 16px;
      `}
    >
      {children}
    </div>
  );
};
