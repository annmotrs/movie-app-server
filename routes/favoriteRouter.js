import { Router } from 'express';
import favoriteController from '../controllers/favoriteController.js';

export const router = new Router();

router.post('/', favoriteController.create);
router.get('/', favoriteController.getFavoritesByUser);
router.delete('/:id', favoriteController.delete);
