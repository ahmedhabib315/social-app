import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CONSTANTS } from 'constants/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(CONSTANTS.validationPipeOptions));
  await app.listen(3000);
}
bootstrap();
