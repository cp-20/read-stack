import type { User } from '@supabase/supabase-js';

export const extractUserInfoFromSupabase = (user: User) => {
  switch (user.app_metadata.provider) {
    case 'github':
      return {
        id: user.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- たぶん大丈夫
        email: user.email!,
        name: user.user_metadata.preferred_username as string,
        displayName: user.user_metadata.full_name as string,
        avatarUrl: user.user_metadata.avatar_url as string,
      };
    case 'google':
      return {
        id: user.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- たぶん大丈夫
        email: user.email!,
        name: user.user_metadata.full_name as string,
        displayName: user.user_metadata.name as string,
        avatarUrl: user.user_metadata.avatar_url as string,
      };
    case 'apple':
      return {
        id: user.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- たぶん大丈夫
        email: user.email!,
        name: 'user',
        displayName: 'user',
        avatarUrl: user.user_metadata.avatar_url as string,
      };
    default:
      throw new Error('invalid provider');
  }
};
