import { z } from 'zod';

export const ClipSearchQuerySchema = z.object({
  unreadOnly: z.boolean().optional(),
});

export type ClipSearchQuery = z.infer<typeof ClipSearchQuerySchema>;
