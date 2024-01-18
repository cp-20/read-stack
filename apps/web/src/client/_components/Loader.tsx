import type { ComponentProps, FC } from 'react';

import styles from './Loader.module.css';
import { useMantineTheme } from '@mantine/core';
import { css } from '@emotion/react';

export const Loader: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const theme = useMantineTheme();
  return (
    <div
      className={`${styles.loader} ${className}`}
      css={css`
        &::before {
          background-color: ${theme.colors[theme.primaryColor][5]};
        }

        &::after {
          background-color: ${theme.colors[theme.primaryColor][2]};
        }
      `}
      {...props}
    />
  );
};
