import {
  ConflictException,
  Injectable,
  NotFoundException,
  //  OnModuleInit,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

// import { Connection, Model } from 'mongoose';
// import { InjectConnection, InjectModel } from '@nestjs/mongoose';
// import mongoose from 'mongoose';

import { SignUpReqDto } from '../../models/dto/user/signUp.req.dto';
import { User } from '../../models/entities/user.entity';
import { UserResDto } from '../../models/dto/user/user.res.dto';
import { SignInReqDto } from '../../models/dto/user/signIn.req.dto';
import { comparePassword } from '../../utils/helpers';
import { UserRepository } from './user.repository';
import { UserUpdateReqDto } from '../../models/dto/user/user-update.req.dto';

@Injectable()
export class UsersService {
  // export class UsersService implements OnModuleInit {
  // private db: Connection['db'];
  constructor(
    private readonly userRepository: UserRepository,
    // @InjectModel('User') private userModel: Model<UserDocument>,
    // @InjectConnection() private readonly connection: Connection,
  ) {}

  // onModuleInit() {
  //   throw new Error('Method not implemented.');
  // }

  // async onModuleInit() {
  //   this.db = this.connection.db;
  // }

  async create(createUserDto: SignUpReqDto): Promise<void> {
    const user = await this.userRepository.findOneByEmail(createUserDto.email);
    if (user) {
      throw new ConflictException('Email already exists');
    }

    await this.userRepository.createUser(createUserDto);
  }

  async findOne(dto: SignInReqDto): Promise<UserResDto> {
    const foundUser =
      await this.userRepository.findOneByUsernameOrEmailOrFail(dto);
    if (
      foundUser &&
      (await comparePassword(dto.password, foundUser.password))
    ) {
      return plainToInstance(User, foundUser, {
        excludeExtraneousValues: true,
      });
    } else {
      throw new NotFoundException(`Wrong credentials`);
    }
  }

  async findOneById(id: string): Promise<UserResDto> {
    const userWithNotificationCount =
      await this.userRepository.findOneUserByIdWithNotificationsCount(id);

    if (!userWithNotificationCount) {
      return null;
    }

    return plainToInstance(User, userWithNotificationCount, {
      excludeExtraneousValues: true,
    });
  }

  async findOneByIdQuery(id: string): Promise<UserResDto> {
    const result =
      await this.userRepository.findOneByIdWithNotificationsCountQuery(id);
    if (!result) {
      throw new NotFoundException(`User not found`);
    }
    const { password, ...user } = result;
    return user;
  }

  public async updateUserProfile(
    userId: string,
    updateDto: UserUpdateReqDto,
  ): Promise<UserResDto> {
    await this.userRepository.checkIfExistsById(userId);
    const user = await this.userRepository.updateUser(userId, updateDto);
    return plainToInstance(User, user, { excludeExtraneousValues: true });
  }

  public async removeUserProfile(userId: string): Promise<void> {
    await this.userRepository.checkIfExistsById(userId);

    await this.userRepository.deleteUser(userId);
  }
}
