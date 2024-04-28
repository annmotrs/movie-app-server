import { Router } from 'express';
import { router as userRouter } from './user.router.js';
import { router as favoriteRouter } from './favorite.router.js';

const router = new Router();

router.use('/user', userRouter);
router.use('/favorite', favoriteRouter);

export default router;
