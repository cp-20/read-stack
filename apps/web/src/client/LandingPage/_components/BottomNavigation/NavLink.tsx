import { css } from '@emotion/react';
import { useMantineTheme } from '@mantine/core';
import type { LinkProps } from 'next/link';
import Link from 'next/link';
import type { FC } from 'react';

export type NavLinkProps = LinkProps & {
  children?: React.ReactNode;
};

export const NavLink: FC<NavLinkProps> = ({ ...props }) => {
  const theme = useMantineTheme();

  return (
    <Link
      css={css`
        color: ${theme.colors[theme.primaryColor][4]};

        &:hover {
          color: ${theme.colors[theme.primaryColor][7]};
        }

        &:active {
          color: ${theme.colors[theme.primaryColor][9]};
        }

        &:visited {
          color: ${theme.colors[theme.primaryColor][2]};
        }
      `}
      {...props}
    />
  );
};
