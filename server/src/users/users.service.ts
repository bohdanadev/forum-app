import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { User } from '../../models/entities/user.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService implements OnModuleInit {
  private db: Connection['db'];
  private userRepository: Repository<User>;
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,
    @Inject('DATA_SOURCE') private dataSource: DataSource,
  ) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async onModuleInit() {
    this.db = this.connection.db;
  }
  async findAll(): Promise<User[]> {
    await this.userModel.find().exec();
    const users = await this.userRepository.find();
    return plainToInstance(User, users, { excludeExtraneousValues: true });
  }
  async findAllQuery(): Promise<any> {
    await this.db
      .collection('users')
      .find({}, { projection: { password: 0 } })
      .toArray();
    const query = 'SELECT * FROM "user"';
    const users = await this.dataSource.query(query);
    return plainToInstance(User, users, { excludeExtraneousValues: true });
  }

  async create(createUserDto: Partial<User>): Promise<any> {
    const createdUser = new this.userModel({
      ...createUserDto,
    });

    await createdUser.save();

    const userEntity = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(userEntity);

    return plainToInstance(User, savedUser, { excludeExtraneousValues: true });
  }
}
