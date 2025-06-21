
import express from 'express';
import {
  getDashboardStats,
  getEquipments,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getCategories,
  createCategory,
  getAssignmentHistory
} from '../controllers/stockController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/dashboard', getDashboardStats);
router.get('/equipment', getEquipments);
router.get('/categories', getCategories);
router.get('/assignments/history', getAssignmentHistory);

// Admin only routes
router.post('/equipment', requireAdmin, createEquipment);
router.put('/equipment/:id', requireAdmin, updateEquipment);
router.delete('/equipment/:id', requireAdmin, deleteEquipment);
router.post('/categories', requireAdmin, createCategory);

export default router;
