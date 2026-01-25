import { NextFunction, Response, Request } from 'express';

interface AttendanceLogBody {
  employeeId: number;
  employeeName: string;

  email: string;
  workStart: string;
  workEnd: string;
  checkedTime: string;

  logDate: Date;
  source?: string;
}

export type AttendanceLogRequest = Request<{}, {}, AttendanceLogBody>
