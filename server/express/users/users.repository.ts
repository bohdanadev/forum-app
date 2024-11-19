import { Repository } from 'typeorm';

import { User } from '../../models/entities/user.entity';
import { myDataSource } from '../../ormconfig';
import { plainToInstance } from 'class-transformer';

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
    const query = 'SELECT * FROM "user"';
    const users = await this.repository.query(query);
    return plainToInstance(User, users, { excludeExtraneousValues: true });
  }

  async findById(id: string): Promise<User | null> {
    const users = this.repository.findOne({ where: { id } });
    return plainToInstance(User, users, { excludeExtraneousValues: true });
  }

  async save(user: Partial<User>): Promise<User> {
    const userEntity = this.repository.create(user);
    const savedUser = this.repository.save(userEntity);
    return plainToInstance(User, savedUser, { excludeExtraneousValues: true });
  }

  async findByEmailNative(email: string): Promise<any> {
    const queryRunner = myDataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const result = await queryRunner.query(
        'SELECT * FROM "user" WHERE email = $1',
        [email],
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
      await queryRunner.query('DELETE FROM "user" WHERE id = $1', [id]);
    } finally {
      await queryRunner.release();
    }
  }
}

export const userRepository = new UserRepository();
