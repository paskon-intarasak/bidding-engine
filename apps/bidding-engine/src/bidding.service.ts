import { Injectable } from '@nestjs/common';

@Injectable()
export class BiddingService {
  getHello(): string {
    return 'Hello World!';
  }
}
