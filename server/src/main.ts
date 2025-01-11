import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { getSessionConfig } from './config/session.config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { getLogger } from './config/logger.config';
import { CacheProvider } from './cache/cache.provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // const cacheProvider = app.get(CacheProvider);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.use(getSessionConfig(configService));
  app.useLogger(getLogger());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips away non-whitelisted properties
      transform: true, // enables transformation
      forbidNonWhitelisted: true, // throws error if non-whitelisted values are provided
    }),
  );

  const config = new DocumentBuilder().setTitle('Chatbot App').setVersion('1.0').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableShutdownHooks();

  await app.listen(configService.getOrThrow('port'));
}
bootstrap();
