import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import attendanceController from '../controller/attendance-controller';
import asyncHandler from '../middleware/async-handler';
import { attendanceLogSchema } from '../validator/attendance-validator';

const router = Router();

router.post(
  '/',
  celebrate({
    [Segments.BODY]: attendanceLogSchema
  }),
  asyncHandler(attendanceController.ingestAttendanceLog)
);

export default router;
