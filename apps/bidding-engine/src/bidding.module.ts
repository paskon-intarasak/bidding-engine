import { Module } from '@nestjs/common';
import { BiddingController } from './bidding.controller';
import { BiddingService } from './bidding.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuctionGateway } from '@app/common';

@Module({
  imports: [
    AuctionGateway,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        APP_PORT: Joi.number().positive().required(),
        APP_REDIS_HOST: Joi.string().required(),
        APP_REDIS_PORT: Joi.number().positive().required(),
        APP_REDIS_PASSWORD: Joi.string().required(),
      }),
    }),
  ],
  controllers: [BiddingController],
  providers: [BiddingService],
})
export class BiddingModule {}
