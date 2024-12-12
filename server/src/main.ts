import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { AppConfig } from 'config/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  app.enableCors({
    origin: appConfig.originUrl,
    methods: '*',
    allowedHeaders: '*',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', appConfig.originUrl);
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization',
      );
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.status(204).end();
    } else {
      next();
    }
  });

  // app.use((req, res, next) => {
  //   res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGINS);
  //   res.setHeader(
  //     'Access-Control-Allow-Methods',
  //     'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   );
  //   res.setHeader(
  //     'Access-Control-Allow-Headers',
  //     'Content-Type, Authorization',
  //   );
  //   res.setHeader('Access-Control-Allow-Credentials', 'true');

  //   if (req.method === 'OPTIONS') {
  //     return res.status(204).end();
  //   }

  //   next();
  // });
  const port = appConfig.nestPort;
  const host = appConfig.host;
  await app.listen(port, () => {
    Logger.log(`Server running on http://${host}:${port}`);
  });
}
bootstrap();
