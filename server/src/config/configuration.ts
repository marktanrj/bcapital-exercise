import { AppConfig } from './configuration.type';

export default (): AppConfig => ({
  port: Number(process.env.PORT) || 3000,
  environment: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT) || 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: process.env.CA_CERT
      ? {
          rejectUnauthorized: true,
          ca: process.env.CA_CERT,
        }
      : false,
  },
});