import { AppError } from '../common/app-error';
import { mysqlPool as db } from '../config/db';
import { ResultSetHeader } from 'mysql2';

class CalendarService {
  async getYearCalendar(year: number) {
    const [rows] = await db.execute<any[]>(
      `
      SELECT
        work_year,
        work_month,
        close_day AS closeDay
      FROM attendance_close_calendar
      WHERE work_year = ?
      ORDER BY work_month ASC
      `,
      [year]
    );

    return rows;
  }

  async updateCloseDay(year: number, month: number, closeDay: number) {
    const [result] = await db.execute<ResultSetHeader>(
      `
      UPDATE attendance_close_calendar
      SET close_day = ?
      WHERE work_year = ? AND work_month = ?
      `,
      [closeDay, year, month]
    );

    if (result.affectedRows === 0) {
      throw AppError.from(new Error('Attendance close calendar not found'), 404);
    }

    const [rows] = await db.execute<any[]>(
      `
      SELECT
        work_year,
        work_month,
        close_day AS closeDay
      FROM attendance_close_calendar
      WHERE work_year = ? AND work_month = ?
      `,
      [year, month]
    );

    return rows[0];
  }
}

export default new CalendarService();
