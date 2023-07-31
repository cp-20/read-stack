import { useSupabaseClient } from '@supabase/auth-helpers-react';

export const useSupabase = () => {
  const supabaseClient = useSupabaseClient();

  const loginWithGitHub = async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabaseClient.auth.signOut();
  };

  return {
    supabaseClient,
    loginWithGitHub,
    logout,
  };
};