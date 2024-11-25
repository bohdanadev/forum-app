import * as mongoose from 'mongoose';
import { UserResDto } from '../../models/dto/user.res.dto';
import { UserModel } from '../../models/schemas/user.schema';
import { userRepository } from './users.repository';
import { IUser } from '../../models/interfaces/user.interface';

class UserService {
  public async getListModel() {
    await userRepository.findAll();
    return await UserModel.find();
  }

  public async getListQuery(): Promise<any> {
    await userRepository.findAllQuery();
    return await UserModel.db
      .collection('users')
      .find({}, { projection: { password: 0 } })
      .toArray();
  }

  public async getById(userId: string): Promise<UserResDto> {
    const user = await UserModel.findById(userId);
    console.log(user);
    return await userRepository.findById(userId);
  }
  public async getByIdQuery(userId: string): Promise<UserResDto> {
    const user = await UserModel.db
      .collection('users')
      .findOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        { projection: { password: 0 } },
      );
    console.log(user);
    return await userRepository.findByIdQuery(userId);
  }

  public async update(userId: string, dto: IUser): Promise<UserResDto> {
    const result = await UserModel.findByIdAndUpdate(userId, dto);
    console.log(result);
    return await userRepository.updateById(userId, dto);
  }

  public async delete(userId: string): Promise<void> {
    await UserModel.findByIdAndDelete(userId);
    await userRepository.deleteById(userId);
  }
}

export const userService = new UserService();
