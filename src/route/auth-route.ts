import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import authenticate from '../middleware/authenticate';


const router = Router();



router.use(authenticate);


export default router;
