import { Router } from 'express';
import asyncHandler from '../middleware/async-handler';
import calendarController from '../controller/calendar-controller';

const router = Router();

router.get('/closing-days', asyncHandler(calendarController.getYearCalendar));

// chỉ HR / Admin mới được sửa
router.put('/closing-days', asyncHandler(calendarController.updateCloseDay));

export default router;
