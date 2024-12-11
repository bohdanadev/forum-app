import { Inject, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../../models/entities/user.entity';
import { SignUpReqDto } from '../../models/dto/user/signUp.req.dto';
import { SignInReqDto } from '../../models/dto/user/signIn.req.dto';
import { UserUpdateReqDto } from '../../models/dto/user/user-update.req.dto';
import { DATA_SOURCE } from '../../utils/constants';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: DataSource) {
    super(User, dataSource.manager);
  }

  public async createUser(createUserDto: SignUpReqDto): Promise<void> {
    const password = await bcrypt.hash(createUserDto.password, 10);
    const userEntity = this.create({
      ...createUserDto,
      password,
    });
    await this.save(userEntity);
  }

  public async findOneByEmail(email: string): Promise<User> {
    return await this.findOneBy({ email });
  }

  public async findOneUserByIdWithNotificationsCount(
    id: string,
  ): Promise<User> {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.notifications', 'notifications')
      .where('user.id = :id', { id })
      .getOne();
  }

  async findOneByIdWithNotificationsCountQuery(
    id: string,
    em?: EntityManager,
  ): Promise<User> {
    const repo = em ? em.getRepository(User) : this;

    const result = await repo.query(
      `
      SELECT 
        u.*, 
        COALESCE(json_agg(n.*) FILTER (WHERE n.id IS NOT NULL), '[]') AS notifications
      FROM 
        users u
      LEFT JOIN 
        notification n ON n."recipientId" = u.id
      WHERE 
        u.id = $1
      GROUP BY 
        u.id
      `,
      [id],
    );

    if (result.length === 0) {
      return null;
    }

    const user = result[0];

    return user;
  }

  public async findOneByUsernameOrEmailOrFail(
    dto: SignInReqDto,
  ): Promise<User> {
    return await this.createQueryBuilder('user')
      .where('user.username = :identifier OR user.email = :identifier', {
        identifier: dto.identifier,
      })
      .getOneOrFail();
  }

  public async updateUser(
    userId: string,
    updateDto: UserUpdateReqDto,
  ): Promise<User> {
    const user = await this.findOneBy({ id: userId });
    this.merge(user, updateDto);
    return await this.save(user);
  }

  public async deleteUser(userId: string): Promise<void> {
    await this.delete({ id: userId });
  }

  async checkIfExistsById(id: string): Promise<User> {
    return await this.findOneByOrFail({ id });
  }
}
