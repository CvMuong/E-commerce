import { z } from 'zod';

export const ListQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
});
export type ListQuery = z.infer<typeof ListQuery>;
