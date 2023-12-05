import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { BiddingService } from './bidding.service';
import { AuctionGateway } from '../../../libs/common/src/auctiongateway/auction.gateway';

@Controller('bidding')
export class BiddingController {
  constructor(
    private readonly biddingService: BiddingService,
    private readonly appGateway: AuctionGateway,
  ) {}

  @Post('bid')
  @HttpCode(HttpStatus.OK)
  async placeBid(
    @Body()
    request: {
      auctionId: string;
      bidAmount: number;
      parentBidId: string | null;
    },
  ) {}
}
