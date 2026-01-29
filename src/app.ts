import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { errors } from 'celebrate';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cron from 'node-cron';

import route from './route';
import connectMySQL from './config/db';
import { responseErr } from './common/app-error';
import { config } from './config/config';
import { bootstrapKafka } from './message-queue/bootstrapKafka';
import attendanceService from './service/attendance-service';

const app = express();

// Kết nối Database + kafka
connectMySQL();
bootstrapKafka();

// Middlewares
// app.use(morgan('combined'));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.fe_domain,
    credentials: true
  })
);
app.use(helmet());
app.use(compression());

// Routes
route(app);

// Celebrate validation errors
app.use(errors());

// Handle global error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  responseErr(err, res);
});

// cron job
// thống kê chấm công hàng ngày vào mỗi 30 phút
cron.schedule('*/30 * * * *', async () => {
  try {
    await attendanceService.runDailyAttendanceStatistics();
  } catch (err) {
    console.error('[CRON] Attendance statistic error', err);
  }
});
attendanceService.runDailyAttendanceStatistics();
export default app;
