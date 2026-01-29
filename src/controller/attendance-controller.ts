import { NextFunction, Response, Request } from 'express';

import { AttendanceFixRequest, AttendanceLogRequest } from '../interface/request';
import { CREATED, OK } from '../common/success-response';
import attendanceService from '../service/attendance-service';

class AttendanceController {
  async ingestAttendanceLog(req: AttendanceLogRequest, res: Response, next: NextFunction) {
    const result = await attendanceService.ingestAttendanceLog(req.body);

    new CREATED({
      metadata: result
    }).send(res);
  }

  async getMonthlyAttendance(req: Request, res: Response, next: NextFunction) {
    const empId = Number(req.query.empId);
    const month = Number(req.query.month);

    const result = await attendanceService.getMonthlyAttendance(empId, month);

    new OK({ metadata: result }).send(res);
  }

  async requestAttendanceFix(req: AttendanceFixRequest, res: Response, next: NextFunction) {
    // TODO: get employeeId from auth token
    const result = await attendanceService.requestAttendanceFix(2, req.body);

    new CREATED({
      metadata: result
    }).send(res);
  }
  
  async approveFix(req: Request, res: Response, next: NextFunction) {
    const fixId = Number(req.params.fixId);
    // TODO: get employeeId from auth token
    const result = await attendanceService.approveFix(fixId, 2);

    new OK({
      metadata: result
    }).send(res);
  }

  async rejectFix(req: Request, res: Response, next: NextFunction) {
    const fixId = Number(req.params.fixId);
    // TODO: get employeeId from auth token
    const result = await attendanceService.rejectFix(fixId, 2);

    new OK({
      metadata: result
    }).send(res);
  }
}

export default new AttendanceController();
