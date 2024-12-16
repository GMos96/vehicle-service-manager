import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConflictException, HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.CONFLICT,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new ConflictException(result);
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
