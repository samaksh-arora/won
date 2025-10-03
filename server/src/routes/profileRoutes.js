import express from 'express';
import {
  getMyProfile,
  getProfileById,
  updateProfile,
  getAllProfiles,
  searchProfiles,
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/me', getMyProfile);
router.put('/me', updateProfile);
router.get('/search', searchProfiles);
router.get('/', getAllProfiles);
router.get('/:userId', getProfileById);

export default router;
