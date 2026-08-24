import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';

function corsOrigins(): string[] {
  if (process.env.CORS_ORIGIN) {
    return process.env.CORS_ORIGIN.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
  }
  return ['http://localhost:3000', 'http://127.0.0.1:3000'];
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Vercel Services forwards /api/* to this service without stripping the
  // prefix. Keep local development routes unchanged while matching that URL.
  if (process.env.VERCEL) {
    app.setGlobalPrefix('api');
  }
  app.disable('x-powered-by');
  app.useBodyParser('json', { limit: '32kb' });
  app.enableCors({ origin: corsOrigins() });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);
}

bootstrap();
