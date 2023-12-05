import { NestFactory } from '@nestjs/core';
import { BiddingModule } from './bidding.module';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { RedisIoAdapter } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(BiddingModule, { cors: true });
  const configService = new ConfigService();
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = {
          property: errors[0].property,
          message: Object.values(errors[0].constraints)[0],
        };
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );
  const redisIoAdapter = new RedisIoAdapter(app, configService);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(configService.getOrThrow<string>('APP_PORT'));
}
bootstrap();
