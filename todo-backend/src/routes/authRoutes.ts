import express from 'express';
import { signup, login, refreshToken, logout } from '../controllers/authController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/signup', asyncHandler(signup));
router.post('/login', asyncHandler(login));
router.post('/refresh', asyncHandler(refreshToken));
router.post('/logout', asyncHandler(logout));

export default router