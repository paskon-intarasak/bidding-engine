import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.getOrThrow('MARIA_HOST'),
        port: configService.getOrThrow('MARIA_PORT'),
        database: configService.getOrThrow('MARIA_DATABASE'),
        username: configService.getOrThrow('MARIA_USERNAME'),
        password: configService.getOrThrow('MARIA_PASSWORD'),
        autoLoadEntities: true,
        synchronize: configService.getOrThrow('MARIA_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  static forFeature(models: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(models);
  }
}
