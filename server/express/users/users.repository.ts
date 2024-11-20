import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { User } from '../../models/entities/user.entity';
import { myDataSource } from '../../ormconfig';
import { IUser } from '../../models/interfaces/user.interface';
import { UserModel } from '../../models/schemas/user.schema';

class UserRepository {
  private readonly repository: Repository<User>;

  constructor() {
    this.repository = myDataSource.getRepository(User);
  }

  async findAll(): Promise<any> {
    const users = this.repository.find();
    return plainToInstance(User, users, { excludeExtraneousValues: true });
  }

  async findAllQuery(): Promise<any> {
    const query = 'SELECT * FROM "users"';
    const users = await this.repository.query(query);
    return plainToInstance(User, users, { excludeExtraneousValues: true });
  }

  async findById(id: string): Promise<User | null> {
    const users = this.repository.findOne({ where: { id } });
    return plainToInstance(User, users, { excludeExtraneousValues: true });
  }

  async create(user: Partial<IUser>): Promise<User> {
    const newUser = await UserModel.create(user);
    console.log('MONGODB:', newUser.toJSON());
    const userEntity = this.repository.create(user);
    const savedUser = this.repository.save(userEntity);
    return plainToInstance(User, savedUser, { excludeExtraneousValues: true });
  }

  async findByEmailNative(email: string): Promise<User> {
    const queryRunner = myDataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const result = await queryRunner.query(
        'SELECT * FROM "users" WHERE email = $1',
        [email],
      );
      return result[0] || null;
    } finally {
      await queryRunner.release();
    }
  }

  async getByParamsQuery(param: string): Promise<User> {
    const queryRunner = myDataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const result = await queryRunner.query(
        'SELECT * FROM "users" WHERE username = $1 OR email = $1 LIMIT 1',
        [param],
      );
      return result[0] || null;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteByIdNative(id: string): Promise<void> {
    const queryRunner = myDataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.query('DELETE FROM "users" WHERE id = $1', [id]);
    } finally {
      await queryRunner.release();
    }
  }
}

export const userRepository = new UserRepository();
