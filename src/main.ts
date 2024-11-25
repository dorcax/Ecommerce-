import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // This ensures transformations like @Transform are applied
    whitelist: true, // Remove fields not defined in DTO
    forbidNonWhitelisted: true, // Throw error for non-whitelisted fields

  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
