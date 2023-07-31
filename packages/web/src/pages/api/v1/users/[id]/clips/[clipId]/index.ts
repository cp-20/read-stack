import { deleteUserClipById } from '@/server/handlers/users/[id]/clips/[clipId]/delete';
import { getUserClipById } from '@/server/handlers/users/[id]/clips/[clipId]/get';
import { updateUserClipById } from '@/server/handlers/users/[id]/clips/[clipId]/patch';

export const GET = getUserClipById;

export const PATCH = updateUserClipById;

export const DELETE = deleteUserClipById;
