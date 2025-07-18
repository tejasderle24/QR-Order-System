import express from 'express';
import { getOrders, getOrdersByTable, createOrder, updateOrderStatus } from '../controllers/order.controller.js';

const router = express.Router();

router.get('/', getOrders);
router.get('/:tableId', getOrdersByTable);
router.post('/', createOrder);
router.put('/:id/status', updateOrderStatus);

export default router;
