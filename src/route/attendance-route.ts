import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import { attendanceFixRequestSchema, attendanceLogSchema } from '../validator/attendance-validator';
import attendanceController from '../controller/attendance-controller';
import asyncHandler from '../middleware/async-handler';
import verifyDevice from '../middleware/verify-device';

const router = Router();

router.get('/', asyncHandler(attendanceController.getMonthlyAttendance));
router.post(
  '/',
  verifyDevice,
  celebrate({
    [Segments.BODY]: attendanceLogSchema
  }),
  asyncHandler(attendanceController.ingestAttendanceLog)
);
// fix đi muộn 3 lần
router.post(
  '/fix',
  celebrate({
    [Segments.BODY]: attendanceFixRequestSchema
  }),
  asyncHandler(attendanceController.requestAttendanceFix)
);

router.put('/fix/:fixId/approve', asyncHandler(attendanceController.approveFix));
router.put('/fix/:fixId/reject', asyncHandler(attendanceController.rejectFix));

export default router;
