import { UserModel } from '../../models/schemas/user.schema';
import { userRepository } from './users.repository';

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
}

export const userService = new UserService();
