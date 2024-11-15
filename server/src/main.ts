import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { AppConfig } from 'config/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');
  const port = appConfig.nestPort;
  const host = appConfig.host;
  await app.listen(port, () => {
    Logger.log(`Server running on http://${host}:${port}`);
  });
}
bootstrap();
