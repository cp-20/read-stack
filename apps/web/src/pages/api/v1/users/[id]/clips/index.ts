import { getUserClips } from '@/server/handlers/users/[id]/clips/get';
import { postUserClips } from '@/server/handlers/users/[id]/clips/post';
import { methodRouter } from '@/server/utils/router';

export default methodRouter({ GET: getUserClips, POST: postUserClips });
