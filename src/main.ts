import { otelSDK } from './tracing';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Sequelize } from 'sequelize-typescript';
import { User } from './models/user.model';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  await otelSDK.start();
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose', 'log'],
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.useGlobalFilters();

  const sequelize = app.get(Sequelize);
  await sequelize.sync();

  const config = new DocumentBuilder()
    .setTitle('Consumer Management API')
    .setDescription('API docs for managing users and consumers')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
