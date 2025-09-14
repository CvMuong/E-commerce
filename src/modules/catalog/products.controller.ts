import type { Request, Response } from 'express';
import { ListQuery } from './products.schemas.js';
import { listProducts } from './products.service.js';

export async function getProducts(req: Request, res: Response) {
  const parse = ListQuery.safeParse(req.query);
  if (!parse.success) return res.status(400).json({ ok: false, errors: parse.error.flatten() });
  const data = await listProducts(parse.data);
  res.json({ ok: true, data, page: parse.data.page, limit: parse.data.limit });
}
