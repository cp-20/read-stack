import { css } from '@emotion/react';
import { Button } from '@mantine/core';
import { IconBrandGithubFilled } from '@tabler/icons-react';
import type { FC } from 'react';
import { useSupabase } from '@/features/supabase/supabaseClient';

export const AuthWithGitHubButton: FC = () => {
  const { loginWithGitHub } = useSupabase();

  return (
    <Button
      type="button"
      variant="filled"
      // アイコンが微妙に満足できない
      leftIcon={<IconBrandGithubFilled />}
      onClick={loginWithGitHub}
      css={css`
        background-color: black;

        &:hover {
          background-color: #222;
        }
      `}
    >
      GitHubで登録
    </Button>
  );
};
