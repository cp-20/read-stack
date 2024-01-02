import { useSupabase } from "@/features/supabase/supabaseClient";
import { css } from "@emotion/react";
import { Button } from "@mantine/core";
import Image from "next/image";
import type { FC } from "react";
import GoogleIcon from "~/public/assets/google-icon.png";

export const AuthWithGoogleButton: FC = () => {
	const { loginWithGoogle } = useSupabase();

	return (
		<Button
			css={css`
        border: 1px solid #aaa;
        background-color: white;
        color: inherit;

        &:hover {
          background-color: #eee;
        }
      `}
			leftIcon={<Image alt="" height={24} src={GoogleIcon} width={24} />}
			onClick={loginWithGoogle}
			type="button"
			variant="outline"
		>
			Googleで認証
		</Button>
	);
};
