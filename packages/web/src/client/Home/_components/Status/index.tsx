import { useArticles } from '@/client/_components/hooks/useArticles';

export const Status = () => {
  const { articles } = useArticles();

  return (
    <div>
      <div>今まで読んだ記事の数: {articles.length}</div>
    </div>
  );
};
