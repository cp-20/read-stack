import { postArticle } from '@/server/handlers/articles/post';
import { methodRouter } from '@/server/utils/router';

export const runtime = 'edge';

export default methodRouter({ POST: postArticle });
