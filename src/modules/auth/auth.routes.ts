import { Router } from 'express';
import { register, login } from './auth.controller.js';
const r = Router();

r.post('/register', register);
r.post('/login', login);
// r.post('/refresh', refreshHandler) // có thể bổ sung
export default r;
