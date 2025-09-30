import { Router } from 'express';
import { createProperty, getPropertyById } from '../controllers/propertyContoller';

const router = Router();

router.post('/', createProperty);
router.get('/:id', getPropertyById);

export default router;
