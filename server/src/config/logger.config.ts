import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';

export const getLogger = () => {
  return WinstonModule.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.ms(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, ms }) => {
            return `[${timestamp}] ${level}: ${message} ${ms}`;
          }),
        ),
      }),
    ],
  });
};
