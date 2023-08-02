import { getArticleById } from '@/server/handlers/articles/by/id/[id]/get';
import { methodRouter } from '@/server/utils/router';

export default methodRouter({ GET: getArticleById });
