import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
  namespace: 'place-bid',
  transports: ['websocket'],
})
export class AuctionGateway {
  @WebSocketServer()
  private readonly server: Server;

  // Handle Connection in this case Join bidding room
  @SubscribeMessage('place-bid-join')
  async joinRoom(client: Socket, roomId: string): Promise<void> {
    console.log(client.id);
    console.log(roomId);
    await client.join(roomId);
  }

  // Handle Disconnect in this case Leave bidding room
  @SubscribeMessage('place-bid-leave')
  async leaveRoom(client: Socket, roomId: string): Promise<void> {
    await client.leave(roomId);
  }

  public placeBidToRoom(roomId: string, payload: any): void {
    this.server.to(roomId).emit('new-bid-placed', payload);
  }
}
