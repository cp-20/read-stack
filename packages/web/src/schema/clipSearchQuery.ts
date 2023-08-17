import { z } from 'zod';

export const ClipSearchQuerySchema = z.object({
  unreadOnly: z.boolean().optional(),
  title: z.string().optional(),
  body: z.string().optional(),
});

export type ClipSearchQuery = z.infer<typeof ClipSearchQuerySchema>;
