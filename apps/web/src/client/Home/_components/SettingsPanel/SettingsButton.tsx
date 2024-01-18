import { SettingsModal } from '@/client/Home/_components/SettingsPanel/SettingsModal';
import { css } from '@emotion/react';
import { UnstyledButton, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings } from '@tabler/icons-react';
import type { FC } from 'react';

export const SettingsButton: FC = () => {
  const theme = useMantineTheme();
  const [opened, handlers] = useDisclosure(false);

  return (
    <div>
      <UnstyledButton
        css={css`
          display: grid;
          width: 2.25rem;
          height: 2.25rem;
          border: 1px solid ${theme.colors.gray[4]};
          border-radius: ${theme.radius.md};
          color: ${theme.colors.gray[5]};
          place-items: center;
        `}
        onClick={handlers.open}
      >
        <IconSettings />
      </UnstyledButton>
      <SettingsModal onClose={handlers.close} opened={opened} />
    </div>
  );
};
