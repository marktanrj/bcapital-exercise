import * as expressSession from 'express-session';
import { ConfigService } from '@nestjs/config';
import { RequestHandler } from 'express';
import { RedisStore } from 'connect-redis';
import { CacheProvider } from '../cache/cache.provider';

export const getSessionConfig = (configService: ConfigService, cacheProvider: CacheProvider): RequestHandler => {
  const isProd = process.env.NODE_ENV === 'production';

  const sessionOptions: expressSession.SessionOptions = {
    store: new RedisStore({ 
      client: cacheProvider.getClient(),
      prefix: 'session:',
    }),
    name: 'sessionId',
    secret: configService.getOrThrow('sessionSecret'),
    resave: false,
    saveUninitialized: false,
    proxy: isProd,
    cookie: {
      httpOnly: true,
      secure: isProd,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: isProd ? 'none' : 'lax',
      domain: isProd ? configService.getOrThrow('sessionDomain') : null,
      path: '/',
    },
  };

  return expressSession(sessionOptions);
};
