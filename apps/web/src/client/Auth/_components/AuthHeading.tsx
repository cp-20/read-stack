import { css } from '@emotion/react';
import type { FC, ReactNode } from 'react';

interface HeadingProps {
  children: ReactNode;
}

export const AuthHeading: FC<HeadingProps> = ({ children }) => {
  return (
    <h1
      css={css`
        text-align: center;
        margin-bottom: 32px;
        color: #111;
      `}
    >
      {children}
    </h1>
  );
};
