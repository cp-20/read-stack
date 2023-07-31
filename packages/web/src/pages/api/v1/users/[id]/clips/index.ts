import { getUserClips } from '@/server/handlers/users/[id]/clips/get';
import { postUserClips } from '@/server/handlers/users/[id]/clips/post';

export const GET = getUserClips;

export const POST = postUserClips;
