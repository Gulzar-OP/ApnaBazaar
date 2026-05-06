import  express from 'express'
import  { addOrderItems, getMyOrders, getOrders, updateOrderStatus } from '../controllers/orderController.js'
import  { protect } from '../middlewares/authMiddleware.js'
import  { admin } from '../middlewares/adminMiddleware.js'

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;