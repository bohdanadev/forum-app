import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PostgresModule } from '../postgres/postgres.module';
import { User } from '../../models/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    PostgresModule,
    // MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
