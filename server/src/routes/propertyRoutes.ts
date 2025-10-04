import { Router } from 'express';
import { createProperty, listProperties, getPropertyById, updateProperty } from '../controllers/propertyContoller';

const router = Router();

router.post('/', createProperty);
router.get('/',listProperties);
router.patch('/:id', updateProperty);
router.get('/:id', getPropertyById);

export default router;
