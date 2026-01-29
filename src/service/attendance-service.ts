import { AttendanceFixRequest, AttendanceLogRequest } from '../interface/request';
import { mysqlPool as db } from '../config/db';
import { ResultSetHeader } from 'mysql2';
import { diffMinutes, overlapMinutes } from '../helper/time-helper';
import { AppError } from '../common/app-error';
import { config } from '../config/config';
import { AttendanceFixResponse } from '../interface/response';

class AttendanceService {
  async ingestAttendanceLog(data: AttendanceLogRequest['body']): Promise<{ attendanceLogId: number }> {
    const sql = `
      INSERT INTO attendance_log
      (employee_id, employee_name, email, log_date, work_start, work_end, checked_time)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute<ResultSetHeader>(sql, [
      data.employeeId,
      data.employeeName,
      data.email,
      data.logDate,
      data.workStart,
      data.workEnd,
      data.checkedTime
    ]);
    return {
      attendanceLogId: result.insertId
    };
  }

  async getMonthlyAttendance(employeeId: number, month: number) {
    const year = new Date().getFullYear();

    const [rows] = await db.execute<any[]>(
      `
      SELECT *
      FROM daily_work_time_analysis
      WHERE employee_id = ?
        AND YEAR(work_date) = ?
        AND MONTH(work_date) = ?
      ORDER BY work_date ASC
      `,
      [employeeId, year, month]
    );

    return rows;
  }

  async runDailyAttendanceStatistics() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const [rows] = await db.execute<any[]>(
      `
    SELECT
      employee_id,
      log_date,
      MIN(checked_time) AS first_check,
      MAX(checked_time) AS last_check,
      MIN(work_start) AS shift_start,
      MAX(work_end) AS shift_end
    FROM attendance_log
    WHERE checked_time IS NOT NULL
      AND log_date = ?
    GROUP BY employee_id, log_date
    `,
      [today]
    );

    for (const row of rows) {
      const { employee_id, log_date, first_check, last_check, shift_start, shift_end } = row;

      if (!first_check || !last_check || !shift_start || !shift_end) continue;

      // Tổng thời gian có mặt
      const inOfficeMinutes = diffMinutes(first_check, last_check);

      // Nghỉ trưa (ví dụ 12:00–13:00)
      const lunchBreakMinutes = overlapMinutes(first_check, last_check, '12:00:00', '13:00:00');

      // Đi muộn / về sớm
      const lateMinutes = diffMinutes(shift_start, first_check, true);
      const earlyLeaveMinutes = diffMinutes(last_check, shift_end, true);
      const lackMinutes = lateMinutes + earlyLeaveMinutes;

      // OT sau giờ kết thúc ca
      const overTimeMinutes = diffMinutes(shift_end, last_check, true);

      // Thời gian làm việc thực tế
      const workTimeMinutes = Math.max(inOfficeMinutes - lunchBreakMinutes - lateMinutes - earlyLeaveMinutes, 0);

      await db.execute(
        `
      INSERT INTO daily_work_time_analysis
      (
        employee_id, work_date,
        first_check_in, last_check_out,
        late_minutes, early_leave_minutes, lack_minutes,
        in_office_minutes, work_time_minutes,
        over_time_minutes,
        shift_start_time, shift_end_time
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        first_check_in = VALUES(first_check_in),
        last_check_out = VALUES(last_check_out),
        late_minutes = VALUES(late_minutes),
        early_leave_minutes = VALUES(early_leave_minutes),
        lack_minutes = VALUES(lack_minutes),
        in_office_minutes = VALUES(in_office_minutes),
        work_time_minutes = VALUES(work_time_minutes),
        over_time_minutes = VALUES(over_time_minutes),
        shift_start_time = VALUES(shift_start_time),
        shift_end_time = VALUES(shift_end_time),
        updated_at = CURRENT_TIMESTAMP
      `,
        [
          employee_id,
          log_date,
          first_check,
          last_check,
          lateMinutes,
          earlyLeaveMinutes,
          lackMinutes,
          inOfficeMinutes,
          workTimeMinutes,
          overTimeMinutes,
          shift_start,
          shift_end
        ]
      );
    }
  }

  async requestAttendanceFix(employeeId: number, data: AttendanceFixRequest['body']): Promise<AttendanceFixResponse> {
    const { workDate, reason } = data;

    const date = new Date(workDate);
    const month = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;

    const canRequest = await this.canRequestFix(employeeId, month);
    if (!canRequest) {
      throw AppError.from(new Error('Attendance fix request limit reached for this month'), 400);
    }

    const [result] = await db.execute<ResultSetHeader>(
      `
    INSERT INTO attendance_fix_request
    (employee_id, work_date, reason, request_month)
    VALUES (?, ?, ?, ?)
    `,
      [employeeId, workDate, reason, month]
    );

    const [rows] = await db.execute<any[]>(
      `
      SELECT
        id,
        employee_id AS employeeId,
        work_date AS workDate,
        reason,
        status,
        requested_at AS requestedAt,
        approved_at AS approvedAt,
        approved_by AS approvedBy
      FROM attendance_fix_request
      WHERE id = ?
      `,
      [result.insertId]
    );

    return rows[0] as AttendanceFixResponse;
  }

  // số lệnh được làm trong 1 tháng
  private async canRequestFix(employeeId: number, month: string) {
    const [rows] = await db.execute<any[]>(
      `
    SELECT COUNT(*) as total
    FROM attendance_fix_request
    WHERE employee_id = ?
      AND request_month = ?
    `,
      [employeeId, month]
    );

    return rows[0].total <= config.request_fix_per_month;
  }

  async approveFix(fixId: number, approverId: number): Promise<AttendanceFixResponse> {
    const [result] = await db.execute<ResultSetHeader>(
      `
    UPDATE attendance_fix_request
    SET status = 'APPROVED',
        approved_by = ?,
        approved_at = NOW()
    WHERE id = ? AND status = 'PENDING'
    `,
      [approverId, fixId]
    );

    if (result.affectedRows === 0) {
      throw AppError.from(new Error('Fix request not found or already processed'), 404);
    }

    return this.getFixById(fixId);
  }

  async rejectFix(fixId: number, approverId: number): Promise<AttendanceFixResponse> {
    const [result] = await db.execute<ResultSetHeader>(
      `
      UPDATE attendance_fix_request
      SET status = 'REJECTED',
          approved_by = ?,
          approved_at = NOW()
      WHERE id = ? AND status = 'PENDING'
      `,
      [approverId, fixId]
    );

    if (result.affectedRows === 0) {
      throw AppError.from(new Error('Fix request not found or already processed'), 404);
    }

    return this.getFixById(fixId);
  }

  // Lấy chi tiết yêu cầu sửa chấm công
  private async getFixById(fixId: number) {
    const [rows] = await db.execute<any[]>(
      `
    SELECT
      id,
      employee_id AS employeeId,
      work_date AS workDate,
      reason,
      status,
      requested_at AS requestedAt,
      approved_at AS approvedAt,
      requested_by AS requestedBy,
      approved_by AS approvedBy
    FROM attendance_fix_request
    WHERE id = ?
    `,
      [fixId]
    );

    return rows[0] ?? null;
  }
}

export default new AttendanceService();
