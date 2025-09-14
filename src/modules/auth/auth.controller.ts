import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RegisterBody, LoginBody } from './auth.schemas.js';
import { createUser, findUserByEmail } from './auth.service.js';
import { env } from '../../config/env.js';
import bcrypt from 'bcrypt';
import ms, { type StringValue } from 'ms';

function isMsString(s: string): s is StringValue {
  return /^\d+(ms|s|m|h|d)$/i.test(s);
}

function toSeconds(v: string | number): number {
  if (typeof v === 'number') return v;
  if (!isMsString(v)) {
    throw new Error('Invalid JWT TTL. Use number (seconds) or strings like "15m", "7d".');
  }
  const msVal = ms(v);               // v đã thu hẹp thành StringValue, OK
  return Math.floor(msVal / 1000);
}

function signTokens(id: number, role: string) {
  const payload = { sub: String(id), role };
  const access = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    algorithm: 'HS256',
    expiresIn: toSeconds(env.ACCESS_TTL),   // number (seconds)
  });

  const refresh = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    algorithm: 'HS256',
    expiresIn: toSeconds(env.REFRESH_TTL),  // number (seconds)
  });

  return { access, refresh };
}

export async function register(req: Request, res: Response) {
  const parse = RegisterBody.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ ok: false, errors: parse.error.flatten() });
  const user = await createUser(parse.data);
  const tokens = signTokens(user.id, user.role);
  res.status(201).json({ ok: true, user, ...tokens });
}

export async function login(req: Request, res: Response) {
  const parse = LoginBody.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ ok: false, errors: parse.error.flatten() });

  const user = await findUserByEmail(parse.data.email);
  if (!user || user.status !== 'active') return res.status(401).json({ ok: false, message: 'Email hoặc mật khẩu sai' });

  const ok = await bcrypt.compare(parse.data.password, user.password_hash);
  if (!ok) return res.status(401).json({ ok: false, message: 'Email hoặc mật khẩu sai' });

  const tokens = signTokens(user.id, user.role);
  res.json({ ok: true, user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role }, ...tokens });
}
