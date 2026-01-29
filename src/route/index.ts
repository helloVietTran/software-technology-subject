import { Express } from 'express';
import authRoute from './auth-route';
import atttendanceRoute from './attendance-route';
import calendarRoute from './calendar-route';
import { config } from '../config/config';

function route(app: Express) {
  const urlPrefix = config.api_prefix + config.api_version;

  app.use(`${urlPrefix}/auth`, authRoute);
  app.use(`${urlPrefix}/attendance`, atttendanceRoute);
  app.use(`${urlPrefix}/calendar`, calendarRoute);
}

export default route;
