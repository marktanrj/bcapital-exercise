import * as expressSession from 'express-session';
import { ConfigService } from '@nestjs/config';
import { RequestHandler } from 'express';

export const getSessionConfig = (configService: ConfigService): RequestHandler  => {
  const sessionOptions: expressSession.SessionOptions = {
    // TODO: redis for prod?
    // store: new RedisStore({ 
    //   client: redisClient,
    // }),
    
    name: 'sessionId',
    secret: configService.getOrThrow('sessionSecret'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax'
    }
  }
  
  return expressSession(sessionOptions);
};