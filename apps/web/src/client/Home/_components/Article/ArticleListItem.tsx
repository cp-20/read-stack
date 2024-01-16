import { css } from '@emotion/react';
import { Text, useMantineTheme } from '@mantine/core';
import type { Article } from '@read-stack/openapi';
import type { ComponentProps, FC, ReactNode } from 'react';

export interface ArticleListItemProps {
  article: Article;
  renderActions?: (article: Article) => ReactNode;
}

export const ArticleListItem: FC<ArticleListItemProps & ComponentProps<'div'>> =
  ({ article, renderActions, ...props }) => {
    const theme = useMantineTheme();
    return (
      <div {...props}>
        <div
          css={css`
            padding: 1rem;
            border: 1px solid ${theme.colors.gray[2]};
            border-radius: ${theme.radius.md};
          `}
        >
          <div
            css={css`
              display: grid;
              gap: 1rem;
              grid-template-columns: 1fr max(30%, 100px);
            `}
          >
            <div
              css={css`
                display: flex;
                min-width: 0;
                flex-direction: column;
                gap: 0.5rem;
              `}
            >
              <Text fw="bold" lineClamp={2}>
                <a
                  css={css`
                  color: ${theme.colors[theme.primaryColor][7]};
                  text-decoration: none;

                  &:hover {
                    text-decoration: underline;
                  }
                `}
                  href={article.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {article.title}
                </a>
              </Text>
              <Text color="dimmed" fz="sm" lineClamp={3}>
                {article.body}
              </Text>
              <Text
                color="dimmed"
                css={css`
                  display: flex;
                  gap: 0.5rem;
                `}
                fz="sm"
              >
                <span>{new URL(article.url).host}</span>
                {/* TODO: もっと精度良くする (クライアントでやるべきかどうかも検討) */}
                <span>{(article.body.length / 500).toFixed(0)} min read</span>
              </Text>
            </div>
            <div>
              {article.ogImageUrl ? (
                <img
                  alt=""
                  css={css`
                    max-height: 120px;
                    object-fit: cover;
                  `}
                  src={article.ogImageUrl}
                  width="100%"
                />
              ) : null}
            </div>
          </div>
          <div
            css={css`
              margin-top: 1rem;
            `}
          >
            {renderActions ? renderActions(article) : null}
          </div>
        </div>
      </div>
    );
  };
