import { getMe } from '@/server/handlers/users/me/get';
import { methodRouter } from '@/server/utils/router';

export const runtime = 'edge';

export default methodRouter({ GET: getMe });
