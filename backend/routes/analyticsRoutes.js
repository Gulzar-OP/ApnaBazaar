import  express from 'express'
import  { getAdminStats } from '../controllers/analyticController.js'
import  { protect,admin  } from '../middlewares/authMiddleware.js'
// import  { admin } from '../middlewares/adminMiddleware.js'

const router = express.Router();

router.get('/', protect, admin, getAdminStats);

export default router;