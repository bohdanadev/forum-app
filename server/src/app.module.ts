import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import configuration from '../config/configuration';
import { PostgresModule } from './postgres/postgres.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Config, MongoConfig } from 'config/config.type';
import { TypeOrmModule } from '@nestjs/typeorm';
import { myDataSource } from '../ormconfig';
import { AuthService } from 'auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from 'notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService<Config>) => ({
    //     uri: configService.get<MongoConfig>('mongo').mongoUrl,
    //   }),
    //   inject: [ConfigService],
    // }),
    TypeOrmModule.forRoot(myDataSource.options),
    UsersModule,
    AuthModule,
    PostsModule,
    PostgresModule,
    JwtModule,
    CommentsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {
  // constructor(private dataSource: DataSource) {}
}
