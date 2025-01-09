import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

export enum APP_ENV {
  DEV = 'development',
  PROD = 'production',
}

const ENV = process.env.NODE_ENV as keyof typeof APP_ENV;

const envFilePaths: Record<string, string> = {
  [APP_ENV.DEV]: '.env.development',
  [APP_ENV.PROD]: '.env.production',
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', envFilePaths[ENV]],
      load: [configuration],
    }),
  ],
  exports: [ConfigModule],
})
export class ConfigurationModule {}
