import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// import { MongooseModule } from '@nestjs/mongoose';
// import { Config, MongoConfig } from 'config/config.type';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import configuration from '../config/configuration';
import { PostgresModule } from './postgres/postgres.module';
import { myDataSource } from '../ormconfig';
import { AuthService } from 'auth/auth.service';
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

  providers: [AuthService],
})
export class AppModule {}
