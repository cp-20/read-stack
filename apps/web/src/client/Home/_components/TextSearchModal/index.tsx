import type { SearchResultArticle } from '@/client/Home/_components/TextSearchModal/textSearch';
import { useTextSearch } from '@/client/Home/_components/TextSearchModal/textSearch';
import { css } from '@emotion/react';
import {
  Center,
  Divider,
  Highlight,
  Modal,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useState, type FC, useEffect } from 'react';
import Image from 'next/image';
import resultPlaceholder from '~/public/assets/no-reading-articles.png';
import noResult from '~/public/assets/no-result.png';
import { Loader } from '@/client/_components/Loader';

interface TextSearchModalProps {
  opened: boolean;
  onClose: () => void;
}

const calcSimilarity = (article: SearchResultArticle, searchText: string) => {
  const titleInclude = article.title.includes(searchText) ? 10 : 0;
  const titleStartWith = article.title.startsWith(searchText) ? 10 : 0;
  const bodyInclude = article.body.includes(searchText) ? 1 : 0;

  return titleInclude + titleStartWith + bodyInclude;
};

export const TextSearchModal: FC<TextSearchModalProps> = ({
  opened,
  onClose,
}) => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebouncedValue(searchText, 100);
  const { articles, loadNext, isLoading } = useTextSearch(debouncedSearchText);

  const sortedArticles = [...articles].sort((a, b) => {
    const aSimilarity = calcSimilarity(a, debouncedSearchText);
    const bSimilarity = calcSimilarity(b, debouncedSearchText);
    return bSimilarity - aSimilarity;
  });

  useEffect(() => {
    loadNext();
  }, [loadNext]);

  const noSearchResult = articles.length === 0 && !isLoading;
  const noSearchText = searchText === '';

  return (
    <Modal onClose={onClose} opened={opened} size="xl" withCloseButton={false}>
      <TextInput
        data-autofocus
        icon={<IconSearch />}
        onChange={(e) => {
          setSearchText(e.currentTarget.value);
        }}
        placeholder="検索したい内容を入力"
        value={searchText}
        variant="unstyled"
      />
      <Divider />
      <div
        css={css`
          padding-top: 1rem;
        `}
      >
        {noSearchResult && noSearchText ? (
          <Stack align="center">
            <Image alt="" height={256} src={resultPlaceholder} width={256} />
            <Text>ここに検索結果が表示されます</Text>
          </Stack>
        ) : null}
        {noSearchResult && !noSearchText ? (
          <Stack align="center">
            <Image alt="" height={256} src={noResult} width={256} />
            <Text>検索結果が見つかりませんでした</Text>
          </Stack>
        ) : null}
        {isLoading ? (
          <Center
            css={css`
              height: 281px;
              margin-top: 1rem;
            `}
          >
            <Loader />
          </Center>
        ) : null}
        <ScrollArea
          css={css`
          display: flex;
          max-height: 50vh;
          flex-direction: column;
          margin: 0 -1rem;
        `}
        >
          {sortedArticles.map((article) => (
            <div
              css={css`
              padding: 1rem;
            `}
              key={article.id}
            >
              <Highlight
                color="blue"
                component="a"
                css={css`
                  &:hover { 
                    text-decoration: underline;
                  }
                `}
                fw="bold"
                highlight={searchText}
                href={article.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {article.title}
              </Highlight>
              <Text color="dimmed" fz="sm" lineClamp={2}>
                {article.body}
              </Text>
            </div>
          ))}
        </ScrollArea>
      </div>
    </Modal>
  );
};
