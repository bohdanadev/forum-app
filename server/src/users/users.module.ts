import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { userSchema } from '../../models/schemas/user.schema';
import { PostgresModule } from '../postgres/postgres.module';

@Module({
  imports: [
    PostgresModule,
    MongooseModule.forFeature([{ name: 'User', schema: userSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
