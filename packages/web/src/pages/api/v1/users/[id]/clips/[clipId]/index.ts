import { deleteUserClipById } from '@/server/handlers/users/[id]/clips/[clipId]/delete';
import { getUserClipById } from '@/server/handlers/users/[id]/clips/[clipId]/get';
import { updateUserClipById } from '@/server/handlers/users/[id]/clips/[clipId]/patch';
import { methodRouter } from '@/server/utils/router';

export const runtime = 'edge';

export default methodRouter({
  GET: getUserClipById,
  PATCH: updateUserClipById,
  DELETE: deleteUserClipById,
});
