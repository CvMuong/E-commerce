import 'dotenv/config';
import { z } from 'zod';

const DurationSchema = z.union([
  z.coerce.number().int().positive(),
  z.string().regex(/^\d+(ms|s|m|h|d)$/i)
]);

const EnvSchema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  ACCESS_TTL: DurationSchema.default('15m'),
  REFRESH_TTL: DurationSchema.default('30d'),
  REDIS_URL: z.string().url().optional(),
});

export const env = EnvSchema.parse(process.env);
