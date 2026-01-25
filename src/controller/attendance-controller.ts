import { NextFunction, Response, Request } from 'express';
import crypto from 'crypto';

import { AttendanceLogRequest } from '../interface/request';
import { kafkaProducer } from '../config/kafka';
import { CREATED } from '../core/success-response';

class AttendanceController {
  async ingestAttendanceLog(req: AttendanceLogRequest, res: Response, next: NextFunction) {
    const { employeeId, employeeName, email, workStart, workEnd, logDate, checkedTime, source } = req.body;
    const eventId = crypto.randomUUID();
    const event = {
      eventId,
      eventType: 'ATTENDANCE_LOG_RECEIVED',
      employee: {
        id: employeeId,
        name: employeeName,
        email
      },
      workShift: {
        start: workStart,
        end: workEnd
      },
      attendance: {
        date: logDate,
        checkedTime
      },
      source,
      createdAt: new Date().toISOString()
    };

    await kafkaProducer.send({
      topic: 'attendance.log.received',
      messages: [
        {
          key: String(employeeId),
          value: JSON.stringify(event)
        }
      ]
    });

    new CREATED({
      message: 'Attendance log has been sent to processing queue',
      metadata: { eventId }
    }).send(res);
  }
}

export default new AttendanceController();
