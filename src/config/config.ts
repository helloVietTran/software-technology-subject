import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
  dotenv.config({
    path: `.env.${process.env.NODE_ENV}`
  });
}

const port = process.env.PORT || 3001;
export const config = {
  envName: process.env.NODE_ENV || 'development',
  port,
  jwtSecret: process.env.JWT_SECRET!,
  refreshSecret: process.env.REFRESH_SECRET!,
  api_prefix: process.env.API_PREFIX || '/api',
  api_version: process.env.API_VERSION || '/v1',
  db: {
    uri: process.env.MYSQL_URI!
  },
  kafka: {
    broker: process.env.KAFKA_BROKERS || 'localhost:9092'
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
  },

  fe_domain: process.env.FE_DOMAIN!,
  be_domain: process.env.BE_DOMAIN!,
  request_fix_per_month: Number(process.env.REQUEST_FIX_PER_MONTH) || 3
};
