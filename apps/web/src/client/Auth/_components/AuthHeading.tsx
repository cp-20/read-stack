import { css } from '@emotion/react';
import type { FC, ReactNode } from 'react';

interface HeadingProps {
  children: ReactNode;
}

export const AuthHeading: FC<HeadingProps> = ({ children }) => {
  return (
    <h1
      css={css`
        margin-bottom: 32px;
        color: #111;
        text-align: center;
      `}
    >
      {children}
    </h1>
  );
};
