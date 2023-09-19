import { css } from '@emotion/react';
import { useSession } from '@supabase/auth-helpers-react';
import { useState, type FC, useEffect } from 'react';

import { NavLink } from './NavLink';
import { LogoutButton } from '@/client/LandingPage/_components/BottomNavigation/LogoutButton';
import { pagesPath } from '@/shared/lib/$path';

export const BottomNavigation: FC = () => {
  const [isLoggingIn, setIsLoggedIn] = useState(false);
  const session = useSession();

  useEffect(() => {
    if (session) {
      setIsLoggedIn(true);
    }
  }, [session]);

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
      {!isLoggingIn && <NavLink href={pagesPath.login.$url()}>LOGIN</NavLink>}
      {isLoggingIn && <LogoutButton>LOGOUT</LogoutButton>}
    </div>
  );
};
