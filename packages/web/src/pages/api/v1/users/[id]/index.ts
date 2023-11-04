import { getUser } from '@/server/handlers/users/[id]/get';
import { methodRouter } from '@/server/utils/router';

export const runtime = 'edge';

export default methodRouter({ GET: getUser });
