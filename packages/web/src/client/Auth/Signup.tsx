import type { FC } from 'react';

import { AuthHeading } from './_components/AuthHeading';
import { AuthLayout } from './_components/AuthLayout';
import { AuthWithGitHubButton } from './_components/AuthWithGitHubButton';
import { useAutoRedirect } from '@/features/supabase/auth';

export const Signup: FC = () => {
  useAutoRedirect('/home');

  return (
    <AuthLayout>
      {/* デザインが簡素過ぎてうーん */}
      <AuthHeading>アカウント登録</AuthHeading>

      <AuthWithGitHubButton />
    </AuthLayout>
  );
};
