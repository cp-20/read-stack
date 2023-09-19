import { css } from '@emotion/react';
import { LoadingOverlay, useMantineTheme } from '@mantine/core';
import { useState, type FC, type ReactNode, useCallback } from 'react';
import { useSupabase } from '@/features/supabase/supabaseClient';

export const LogoutButton: FC<{ children: ReactNode }> = ({ children }) => {
  const theme = useMantineTheme();
  const [loading, setLoading] = useState(false);
  const { logout } = useSupabase();
  const clickHandler = useCallback(async () => {
    setLoading(true);
    await logout();
    setLoading(false);
  }, [logout]);

  return (
    <button
      onClick={clickHandler}
      disabled={loading}
      css={css`
        position: relative;
        color: ${theme.colors[theme.primaryColor][4]};
        font-family: inherit;
        text-decoration: underline;

        &:hover:not(:disabled) {
          color: ${theme.colors[theme.primaryColor][7]};
        }

        &:active:not(:disabled) {
          color: ${theme.colors[theme.primaryColor][9]};
        }
      `}
    >
      <LoadingOverlay visible={loading} loaderProps={{ size: 'xs' }} />
      {children}
    </button>
  );
};
