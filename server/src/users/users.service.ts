import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Connection, Model } from 'mongoose';
import { User } from '../../models/entities/user.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { SignUpReqDto } from '../../models/dto/signUp.req.dto';
import { UserResDto } from '../../models/dto/user.res.dto';
import { IUser } from '../../models/interfaces/user.interface';
import { UserDocument } from '../../models/schemas/user.schema';
import { SignInReqDto } from '../../models/dto/signIn.req.dto';
import { comparePassword } from '../../utils/helpers';

@Injectable()
export class UsersService {
  // export class UsersService implements OnModuleInit {
  // private db: Connection['db'];
  private userRepository: Repository<User>;
  constructor(
    // @InjectModel('User') private userModel: Model<UserDocument>,
    // @InjectConnection() private readonly connection: Connection,
    @Inject('DATA_SOURCE') private dataSource: DataSource,
  ) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  // onModuleInit() {
  //   throw new Error('Method not implemented.');
  // }

  // async onModuleInit() {
  //   this.db = this.connection.db;
  // }

  // async findAll(): Promise<User[]> {
  //   await this.userModel.find().exec();
  //   const users = await this.userRepository.find();
  //   return plainToInstance(User, users, { excludeExtraneousValues: true });
  // }
  // async findAllQuery(): Promise<any> {
  //   await this.db
  //     .collection('users')
  //     .find({}, { projection: { password: 0 } })
  //     .toArray();
  //   const query = 'SELECT * FROM "users"';
  //   const users = await this.dataSource.query(query);
  //   return plainToInstance(User, users, { excludeExtraneousValues: true });
  // }

  async create(createUserDto: SignUpReqDto): Promise<UserResDto> {
    //Mongo

    // const existingUser = await this.userModel
    //   .findOne({ email: createUserDto.email })
    //   .exec();
    // if (existingUser) {
    //   throw new ConflictException('Email already exists');
    // }
    // const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    // const createdUser = new this.userModel({
    //   ...createUserDto,
    //   password: hashedPassword,
    // });

    // const newUser = await createdUser.save();
    // console.log(newUser.toJSON());

    //POSTGRES
    const user = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (user) {
      throw new ConflictException('Email already exists');
    }
    const password = await bcrypt.hash(createUserDto.password, 10);
    const userEntity = this.userRepository.create({
      ...createUserDto,
      password,
    });
    const savedUser = await this.userRepository.save(userEntity);

    return plainToInstance(User, savedUser, { excludeExtraneousValues: true });
  }

  async findOne(dto: SignInReqDto): Promise<any> {
    // Mongo
    // const existingUser = await this.userModel.findOne({
    //   $or: [{ email: dto.identifier }, { username: dto.identifier }],
    // });
    // if (existingUser && (await existingUser.comparePassword(dto.password))) {
    //   // return existingUser.toJSON();
    //   console.log(existingUser.toJSON());
    // } else {
    //   throw new NotFoundException(`Wrong credentials`);
    // }

    // Postgres
    const foundUser = await this.userRepository.findOne({
      where: [{ username: dto.identifier }, { email: dto.identifier }],
    });
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

  async findOneById(id: string): Promise<IUser> {
    // Mongo
    // const existingUser = await this.userModel.findById(id);
    // if (!existingUser) {
    //   throw new NotFoundException(`User not found`);
    // }
    // console.log(existingUser.toJSON());

    // Postgres
    const foundUser = await this.userRepository.findOne({
      where: { id },
      relations: ['notifications'],
    });
    if (!foundUser) {
      throw new NotFoundException(`User not found`);
    }
    // const unreadNotificationsCount = foundUser.notifications.filter(
    //   (n) => !n.isRead,
    // ).length;

    console.log(foundUser);

    return plainToInstance(User, foundUser, { excludeExtraneousValues: true });
  }

  async findOneByIdQuery(id: string): Promise<any> {
    //Mongo
    // console.log('ID:', id);
    // const existingUser = await this.db.collection('users').findOne(
    //   {
    //     _id: new mongoose.Types.ObjectId(id),
    //   },
    //   { projection: { password: 0 } },
    // );
    // console.log(existingUser);

    //Postgres
    const query = `
      SELECT * FROM "users"
      WHERE id = $1
      LIMIT 1
    `;

    const result = await this.dataSource.query(query, [id]);

    return result[0]
      ? plainToInstance(User, result[0], { excludeExtraneousValues: true })
      : undefined;
  }

  async findOneQuery(identifier: string): Promise<IUser> {
    //Mongo
    // const existingUser = await this.db.collection('users').findOne(
    //   {
    //     $or: [{ email: identifier }, { username: identifier }],
    //   },
    //   { projection: { password: 0 } },
    // );
    // console.log(existingUser);
    //Postgres
    const query = `
      SELECT * FROM "users"
      WHERE username = $1 OR email = $1
      LIMIT 1
    `;

    const result = await this.dataSource.query(query, [identifier]);

    return result[0]
      ? plainToInstance(User, result[0], { excludeExtraneousValues: true })
      : undefined;
  }

  public async updateUserProfile(userData: string, dto: IUser): Promise<User> {
    //MONGO
    // const result = await this.userModel.updateOne(
    //   { _id: new mongoose.Types.ObjectId(userData) },
    //   dto,
    // );
    // console.log(result);

    //Postgres
    const user = await this.userRepository.findOneBy({ id: userData });
    this.userRepository.merge(user, dto);
    return await this.userRepository.save(user);
  }

  public async removeUserProfile(userData: string): Promise<void> {
    //MONGO
    // await this.userModel.deleteOne({
    //   _id: new mongoose.Types.ObjectId(userData),
    // });
    //Postgres
    await this.userRepository.delete({ id: userData });
  }
}
