import { Request, Response, NextFunction } from 'express';
import { OK } from '../common/success-response';
import calendarService from '../service/calendar-service';

class CalendarController {
  async getYearCalendar(req: Request, res: Response, next: NextFunction) {
    const year = Number(req.query.year);

    const result = await calendarService.getYearCalendar(year);

    new OK({ metadata: result }).send(res);
  }

  async updateCloseDay(req: Request, res: Response, next: NextFunction) {
    const year = Number(req.body.year);
    const month = Number(req.body.month);
    const closeDay = Number(req.body.closeDay);

    const result = await calendarService.updateCloseDay(year, month, closeDay);

    new OK({ metadata: result }).send(res);
  }
}

export default new CalendarController();
