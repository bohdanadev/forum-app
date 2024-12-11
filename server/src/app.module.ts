import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import * as dotenv from 'dotenv';

import getter from '../config/configuration';

dotenv.config({ path: './environments/local.env' });

const databaseConfig = getter().postgres;

// import { MongooseModule } from '@nestjs/mongoose';
// import { Config, MongoConfig } from 'config/config.type';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import configuration from '../config/configuration';
import { PostgresModule } from './postgres/postgres.module';
// import { myDataSource } from '../ormconfig';
import { AuthService } from 'auth/auth.service';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from '../models/entities/notification.entity';
import { Comment } from '../models/entities/comment.entity';
import { Like } from '../models/entities/like.entity';
import { Post } from '../models/entities/post.entity';
import { User } from '../models/entities/user.entity';

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
    // TypeOrmModule.forRoot(myDataSource.options),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: databaseConfig.dbUrl,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [path.join(__dirname, '**', '**', '*.entity.{ts,js}')],
      migrations: [path.join(__dirname, 'src', 'migrations', '*.{ts,js}')],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([User, Post, Comment, Like, Notification]),

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
