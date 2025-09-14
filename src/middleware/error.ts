import express from 'express';
import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status ?? 500;
  const msg = err.message ?? 'Internal Error';
  if (status >= 500) console.error(err);
  res.status(status).json({ ok: false, message: msg });
}
