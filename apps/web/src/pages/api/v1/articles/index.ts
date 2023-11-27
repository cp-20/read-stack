import { postArticle } from '@/server/handlers/articles/post';
import { methodRouter } from '@/server/utils/router';

export default methodRouter({ POST: postArticle });
