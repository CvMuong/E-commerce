import { Router } from 'express';
import { getProducts } from './products.controller.js';

const r = Router();
r.get('/', getProducts);
// r.get('/:slugOrId', getProductDetail)
export default r;
