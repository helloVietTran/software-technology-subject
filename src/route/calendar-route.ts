import { Router } from 'express';
import asyncHandler from '../middleware/async-handler';
import calendarController from '../controller/calendar-controller';
import { celebrate, Segments } from 'celebrate';
import { updateCloseDaySchema } from '../validator/calendar-validator';
import { uploadExcel } from '../middleware/upload-excel';

const router = Router();

router.get('/closing-days', asyncHandler(calendarController.getYearCalendar));

// chỉ HR / Admin mới được sửa
router.put(
  '/closing-days',
  celebrate({
    [Segments.BODY]: updateCloseDaySchema
  }),
  asyncHandler(calendarController.updateCloseDay)
);

router.post(
  '/import',
  uploadExcel.single('file'),
  asyncHandler(calendarController.importWorkingCalendar)
);


export default router;
