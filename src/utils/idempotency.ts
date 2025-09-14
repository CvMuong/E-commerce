import type { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';
import { env } from '../config/env.js';

const client = env.REDIS_URL ? createClient({ url: env.REDIS_URL }) : undefined;
if (client) client.connect();

export function idempotent(ttlSec = 600) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = (req.header('Idempotency-Key') || '').trim();
      if (!client || !key) return next();

      const existed = await client.get(key);
      if (existed) {
        const payload = JSON.parse(existed);
        return res.status(payload.status).json(payload.body);
      }

      // Monkey patch res.json để lưu kết quả
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        client.setEx(key, ttlSec, JSON.stringify({ status: res.statusCode, body }));
        return originalJson(body);
      };
      next();
    } catch (e) { next(e); }
  };
}
