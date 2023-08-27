import { css } from '@emotion/react';
import type { FC } from 'react';

import { NavLink } from './NavLink';
import { pagesPath } from '@/shared/lib/$path';

export const BottomNavigation: FC = () => {
  return (
    <div
      css={css`
        display: flex;
        width: min(100%, 600px);
        justify-content: space-around;
        padding: 16px 0;
        margin: 0 auto;
      `}
    >
      <NavLink href={pagesPath.$url()}>TOP</NavLink>
      <NavLink href={pagesPath.home.$url()}>HOME</NavLink>
      <NavLink href={pagesPath.login.$url()}>LOGIN</NavLink>
    </div>
  );
};
