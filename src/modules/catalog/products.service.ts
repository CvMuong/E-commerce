import { q } from '../../db/index.js';
import type { ListQuery } from './products.schemas.js';

export async function listProducts(query: ListQuery) {
  const { page, limit } = query;
  const offset = (page - 1) * limit;
  const params: any[] = [];
  let where = '';

  if (query.search && query.search.length) {
    params.push(`%${query.search}%`);
    where = `WHERE (p.name ILIKE $${params.length} OR p.slug ILIKE $${params.length})`;
  }

  const sql = `
    SELECT p.id, p.name, p.slug,
           MIN(pv.price) AS min_price,
           MAX(pv.price) AS max_price
    FROM products p
    JOIN product_variants pv ON pv.product_id = p.id AND pv.is_active = true
    ${where}
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  const { rows } = await q(sql, params);
  return rows as Array<{ id: number; name: string; slug: string; min_price: string; max_price: string }>;
}
