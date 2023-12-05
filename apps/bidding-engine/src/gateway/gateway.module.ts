import { Module } from '@nestjs/common';
import { AuctionGateway } from './auction.gateway';

@Module({
  providers: [AuctionGateway],
  exports: [AuctionGateway],
})
export class GatewayModule {}
