import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function auth(roles?: Array<'customer' | 'staff' | 'admin'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : '';
      if (!token) throw new Error('Missing token');

      const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string; role: any };
      req.user = { sub: payload.sub, role: payload.role };

      if (roles && !roles.includes(req.user.role)) return res.status(403).json({ ok: false, message: 'Forbidden' });
      next();
    } catch {
      res.status(401).json({ ok: false, message: 'Unauthorized' });
    }
  };
}
