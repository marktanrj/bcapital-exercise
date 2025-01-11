import { Session } from 'express-session';
import { User } from '../modules/user/user.model';

declare module 'express-session' {
  interface Session {
    userId?: string;
    username?: string;
  }
}

declare module 'express' {
  interface Request {
    session: Session;
    user: User;
  }
}
