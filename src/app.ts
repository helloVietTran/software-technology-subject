import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { errors } from 'celebrate';
import cors from 'cors';
import helmet from 'helmet';
import compression from "compression";

import route from './route';
import connectMySQL from './config/db';
import { createTopicIfNotExists, initKafkaProducer } from './config/kafka';
import { responseErr } from './core/error';
import { config } from './config/config';


const app = express();

// Kết nối Database
connectMySQL();
initKafkaProducer();
createTopicIfNotExists();

// Middlewares
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
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

export default app;