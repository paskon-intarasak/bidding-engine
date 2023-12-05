import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Redis, Cluster } from 'ioredis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server, ServerOptions, Socket } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  constructor(
    app: INestApplication,
    private readonly configService: ConfigService,
  ) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const redisHost = this.configService.getOrThrow('APP_REDIS_HOST');
    const redisPort = this.configService.getOrThrow('APP_REDIS_PORT');
    const redisPassword = this.configService.getOrThrow('APP_REDIS_PASSWORD');
    let publish: Redis | Cluster = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
    });
    const subscribe = publish.duplicate();
    publish.on('error', (error) => {
      console.log('redis connection failed: ', error);
    });
    subscribe.on('error', (error) => {
      console.log('redis connection failed: ', error);
    });
    this.adapterConstructor = createAdapter(publish, subscribe);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server: Server = super.createIOServer(port, options) as Server;
    server.adapter(this.adapterConstructor);
    const webSocketConfig = this.configService.get<any>('webSocket');
    const timeout: number =
      webSocketConfig?.websocketHearthbeatTimeout || 30000;
    setInterval(() => {
      const clients: Map<string, Socket> = server.sockets.sockets;
      Object.keys(clients).forEach((socketId) => {
        const socket: Socket = clients[socketId] as Socket;
        if (socket.connected) {
          socket.send('ping');
        }
      });
    }, timeout);

    server.on('connection', (socket) => {
      socket.on('message', (message: string) => {
        if (message === 'pong') {
          const pingTimeout = socket['pingTimeout'] as { refresh: () => void };
          pingTimeout.refresh();
        }
      });
    });
    return server;
  }
}
