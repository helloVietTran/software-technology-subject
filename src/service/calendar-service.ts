import { ResultSetHeader } from 'mysql2';
import XLSX from 'xlsx';

import { AppError } from '../common/app-error';
import { mysqlPool as db } from '../config/db';

import { isWeekend } from '../helper/time-helper';

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

  async importWorkingCalendarFromExcel(filePath: string) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });
    if (!rows.length) return { inserted: 0 };

    // 1. Clear bảng cũ
    await db.execute(`TRUNCATE TABLE working_calendar`);

    let inserted = 0;
    let year: number = new Date().getFullYear(); // mặc định là năm hiện tại

    // 2. Insert dữ liệu từ file
    for (const row of rows) {
      const date = row.date;
      if (!date) continue;

      const description = row.description;
      const type = row.type;

      await db.execute(
        `
      INSERT INTO working_calendar (work_date, date_description, date_type)
      VALUES (?, ?, ?)
      `,
        [date, description, type]
      );

      inserted++;
    }

    // 3. Auto add weekend (không ghi đè file config)
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31`);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (!isWeekend(d)) continue;

      const dateStr = d.toISOString().slice(0, 10);

      await db.execute(
        `
      INSERT IGNORE INTO working_calendar
        (work_date, date_description, date_type)
      VALUES (?, 'Ngày nghỉ cuối tuần', 'WEEKEND')
      `,
        [dateStr]
      );
    }

    return {
      inserted_from_excel: inserted,
      year
    };
  }
}

export default new CalendarService();
