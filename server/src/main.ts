import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { getSessionConfig } from './config/session.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(getSessionConfig(configService));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // strips away non-whitelisted properties
    transform: true, // enables transformation
    forbidNonWhitelisted: true, // throws error if non-whitelisted values are provided
  }));

  await app.listen(3000);
}
bootstrap();
