import { User } from '../../models/schemas/user.schema';
import { userRepository } from './users.repository';

class UserService {
  public async create(body) {
    return await User.create(body);
  }

  public async getListModel() {
    await userRepository.findAll();
    return await User.find();
  }

  public async getListQuery(): Promise<any> {
    await userRepository.findAllQuery();
    return await User.db
      .collection('users')
      .find({}, { projection: { password: 0 } })
      .toArray();
  }
}

export const userService = new UserService();
