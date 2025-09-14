import { Pool } from 'pg';
import { env } from '../config/env.js';

export const pool = new Pool({ connectionString: env.DATABASE_URL });
export const q = (text: string, params?: any[]) => pool.query(text, params);
