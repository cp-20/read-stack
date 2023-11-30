import { css } from '@emotion/react';
import type { FC, ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div
      css={css`
        display: flex;
        max-width: 540px;
        flex-direction: column;
        padding: 64px 16px 0;
        margin: 0 auto;
      `}
    >
      {children}
    </div>
  );
};
