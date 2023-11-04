import { getArticleByUrl } from '@/server/handlers/articles/by/url/get';
import { methodRouter } from '@/server/utils/router';

export const runtime = 'edge';

export default methodRouter({ GET: getArticleByUrl });
