import { Request } from 'express';

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

interface AttendanceFixBody {
    /**
     * Ngày bị lỗi chấm công (YYYY-MM-DD)
     */
    workDate: string;
    reason?: string;
}


export type AttendanceLogRequest = Request<{}, {}, AttendanceLogBody>
export type AttendanceFixRequest = Request<{}, {}, AttendanceFixBody>