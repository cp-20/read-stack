import { LogoutButton } from '@/client/LandingPage/_components/BottomNavigation/LogoutButton';
import { pagesPath } from '@/shared/lib/$path';
import { css } from '@emotion/react';
import { useSession } from '@supabase/auth-helpers-react';
import { type FC, useEffect, useState } from 'react';
import { NavLink } from './NavLink';

export const BottomNavigation: FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
      <NavLink href={pagesPath.api_key.$url()}>API KEY</NavLink>
      {!isLoggedIn && <NavLink href={pagesPath.login.$url()}>LOGIN</NavLink>}
      {isLoggedIn ? (
        <LogoutButton
          afterLogout={() => {
            setIsLoggedIn(false);
          }}
        >
          LOGOUT
        </LogoutButton>
      ) : null}
    </div>
  );
};
