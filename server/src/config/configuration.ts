import { AppConfig } from './configuration.type';

export default (): AppConfig => ({
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  port: Number(process.env.PORT) || 4000,
  environment: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET || 'secret-key',
  sessionDomain: process.env.SESSION_DOMAIN, // cookie domain, only used for production
  database: {
    url: process.env.DATABASE_URL, // either url or host/port/user/password/database
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT) || 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  cache: {
    url: process.env.REDIS_URL || process.env.REDIS_PRIVATE_URL, // either url or host/port
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-haiku-latest',
  },
})