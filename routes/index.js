import { Router } from 'express';
import { router as userRouter } from './userRouter.js';
import { router as favoriteRouter } from './favoriteRouter.js';

const router = new Router();

router.use('/user', userRouter);
router.use('/favorite', favoriteRouter);

export default router;
