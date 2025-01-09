import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { getSessionConfig } from './config/session.config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(getSessionConfig(configService));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // strips away non-whitelisted properties
    transform: true, // enables transformation
    forbidNonWhitelisted: true, // throws error if non-whitelisted values are provided
  }));

  const config = new DocumentBuilder()
    .setTitle('Chatbot App')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
