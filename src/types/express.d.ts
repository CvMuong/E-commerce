import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { sub: string; role: 'customer' | 'staff' | 'admin' };
    rawBody?: string;
  }
}
