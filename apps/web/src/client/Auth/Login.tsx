import { AuthWithGoogleButton } from "@/client/Auth/_components/AuthWithGoogleButton";
import { useAutoRedirectIfLoggedIn } from "@/features/supabase/auth";
import { Stack } from "@mantine/core";
import type { FC } from "react";
import { AuthHeading } from "./_components/AuthHeading";
import { AuthLayout } from "./_components/AuthLayout";
import { AuthWithGitHubButton } from "./_components/AuthWithGitHubButton";

export const Login: FC = () => {
	useAutoRedirectIfLoggedIn("/home");

	return (
		<AuthLayout>
			<AuthHeading>ログイン</AuthHeading>
			<Stack spacing={16}>
				<AuthWithGitHubButton />
				<AuthWithGoogleButton />
			</Stack>
		</AuthLayout>
	);
};
