import { getMe } from '@/server/handlers/users/me/get';
import { methodRouter } from '@/server/utils/router';

export default methodRouter({ GET: getMe });
