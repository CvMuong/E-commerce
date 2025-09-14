import { q } from '../../db/index.js';
import bcrypt from 'bcrypt';

export async function createUser(data: { email: string; password: string; full_name: string }) {
  const hash = await bcrypt.hash(data.password, 12);
  const sql = `INSERT INTO users(email, password_hash, full_name) VALUES ($1,$2,$3)
               RETURNING id, email, full_name, role`;
  const { rows } = await q(sql, [data.email, hash, data.full_name]);
  return rows[0] as { id: number; email: string; full_name: string; role: 'customer'|'staff'|'admin' };
}

export async function findUserByEmail(email: string) {
  const { rows } = await q(
    `SELECT id, email, full_name, role, status, password_hash FROM users WHERE lower(email)=lower($1)`,
    [email],
  );
  return rows[0] as (undefined | {
    id: number; email: string; full_name: string; role: 'customer'|'staff'|'admin'; status: 'active'|'blocked'; password_hash: string;
  });
}
