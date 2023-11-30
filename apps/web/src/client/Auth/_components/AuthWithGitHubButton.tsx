import { css } from '@emotion/react';
import { Button } from '@mantine/core';
import { IconBrandGithubFilled } from '@tabler/icons-react';
import type { FC } from 'react';
import { useSupabase } from '@/features/supabase/supabaseClient';

export const AuthWithGitHubButton: FC = () => {
  const { loginWithGitHub } = useSupabase();

  return (
    <Button
      css={css`
        background-color: black;

        &:hover {
          background-color: #222;
        }
      `}
      // アイコンが微妙に満足できない
      leftIcon={<IconBrandGithubFilled />}
      onClick={loginWithGitHub}
      type="button"
      variant="filled"
    >
      GitHubで登録
    </Button>
  );
};
