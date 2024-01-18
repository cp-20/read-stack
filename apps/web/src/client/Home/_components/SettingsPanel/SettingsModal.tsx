import { useRssItems } from '@/client/Home/_components/SettingsPanel/useRssItems';
import { css } from '@emotion/react';
import {
  ActionIcon,
  Button,
  Center,
  Loader,
  Modal,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { IconReload, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import type { FormEventHandler, FC } from 'react';

interface SettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

export const SettingsModal: FC<SettingsModalProps> = ({ opened, onClose }) => {
  const theme = useMantineTheme();
  const { rssItems, isLoading, refresh, addNewRss, deleteRss } = useRssItems();

  const [newRssUrl, setNewRssUrl] = useState('');
  const [newRssName, setNewRssName] = useState('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    addNewRss(newRssUrl, newRssName || null);
    setNewRssUrl('');
  };

  return (
    <Modal onClose={onClose} opened={opened} title="設定">
      <Text fw="bold" mb="xs">
        購読しているRSS
      </Text>
      {isLoading ? (
        <Center h="128px">
          <Loader />
        </Center>
      ) : null}
      {!isLoading && rssItems === undefined && (
        <>
          <Text color="red" mb="md">
            読み込み中にエラーが発生しました
          </Text>
          <Button
            fullWidth
            leftIcon={<IconReload />}
            onClick={refresh}
            variant="light"
          >
            再読み込み
          </Button>
        </>
      )}
      {!isLoading && rssItems !== undefined && (
        <>
          {rssItems.length === 0 && <Text>購読しているRSSはありません</Text>}
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
            `}
          >
            {rssItems.map((rssItem) => (
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  gap: 0.5rem;
                `}
                key={rssItem.url}
              >
                <div
                  css={css`
                    display: flex;
                    gap: 0.25rem;
                  `}
                >
                  <a
                    css={css`
                      color: ${theme.colors.blue[6]};
                      text-decoration: none;
                      word-break: break-all;

                      &:hover {
                        text-decoration: underline;
                      }
                    `}
                    href={rssItem.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {rssItem.url}
                  </a>
                  {rssItem.name !== '' && rssItem.name !== null && (
                    <span>({rssItem.name})</span>
                  )}
                </div>

                <ActionIcon
                  onClick={() => {
                    deleteRss(rssItem.url);
                  }}
                >
                  <IconTrash />
                </ActionIcon>
              </div>
            ))}
          </div>
          <form
            css={css`
              display: flex;
              flex-direction: column;
              margin-top: 1rem;
              gap: 0.5rem;
            `}
            onSubmit={handleSubmit}
          >
            <TextInput
              css={css`
                flex: 1;
              `}
              onChange={(e) => {
                setNewRssUrl(e.target.value);
              }}
              placeholder="https://example.com/feed"
              value={newRssUrl}
            />
            <TextInput
              css={css`
                flex: 1;
              `}
              onChange={(e) => {
                setNewRssName(e.target.value);
              }}
              placeholder="識別名 (任意)"
              value={newRssName}
            />
            <Button type="submit">追加</Button>
          </form>
        </>
      )}
    </Modal>
  );
};
