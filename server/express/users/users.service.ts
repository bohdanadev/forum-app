import * as mongoose from 'mongoose';
import { HttpStatus } from '@nestjs/common';

import { UserResDto } from '../../models/dto/user.res.dto';
import { UserModel } from '../../models/schemas/user.schema';
import { IUser } from '../../models/interfaces/user.interface';
import { BaseUserReqDto } from '../../models/dto/user.req.dto';
import { SignInReqDto } from '../../models/dto/signIn.req.dto';
import { ApiError } from '../common/api-error';
import { UserInterface } from '../../models/schemas/post.schema';

class UserService {
  public async getListModel() {
    // await userRepository.findAll();
    return await UserModel.find();
  }

  public async getListQuery(): Promise<any> {
    // await userRepository.findAllQuery();
    return await UserModel.db
      .collection('users')
      .find({}, { projection: { password: 0 } })
      .toArray();
  }

  async getByParamsQuery(dto: SignInReqDto): Promise<IUser> {
    const existingUser = await UserModel.findOne({
      $or: [{ email: dto.identifier }, { username: dto.identifier }],
    }).populate({
      path: 'notifications',
      populate: [
        { path: 'actor', select: 'id username avatarUrl' },
        { path: 'post', select: 'id title' },
        { path: 'comment', select: 'id content' },
      ],
    });
    if (existingUser && (await existingUser.comparePassword(dto.password))) {
      return existingUser.toJSON();
    } else {
      throw new ApiError(`Wrong credentials`, HttpStatus.BAD_REQUEST);
    }
  }

  public async getById(userId: string): Promise<IUser> {
    const user = await UserModel.findById(userId)
      .populate({
        path: 'notifications',
        populate: [
          { path: 'actor', select: 'id username avatarUrl' },
          { path: 'post', select: 'id title' },
          { path: 'comment', select: 'id content' },
        ],
      })
      .exec();
    return user.toJSON() as IUser;
    // return await userRepository.findById(userId);
  }
  // public async getByIdQuery(userId: string): Promise<UserInterface> {
  //   const id = new mongoose.Types.ObjectId(userId);
  // const user = await UserModel.aggregate([
  //   { $match: { _id: id } },
  //   {
  //     $project: {
  //       password: 0,
  //     },
  //   },
  // ]);

  // return user.length > 0 ? user[0] : null;
  //  return await userRepository.findByIdQuery(userId);
  // }

  public async getByIdQuery(userId: string): Promise<UserInterface> {
    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'notifications',
          localField: '_id',
          foreignField: 'recipient',
          as: 'notifications',
        },
      },
      {
        $unwind: {
          path: '$notifications',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'notifications.actor',
          foreignField: '_id',
          as: 'notifications.actor',
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: 'notifications.post',
          foreignField: '_id',
          as: 'notifications.post',
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'notifications.comment',
          foreignField: '_id',
          as: 'notifications.comment',
        },
      },
      {
        $group: {
          _id: '$_id',
          username: { $first: '$username' },
          email: { $first: '$email' },
          avatarUrl: { $first: '$avatarUrl' },
          notifications: {
            $push: {
              _id: '$notifications._id',
              message: '$notifications.message',
              isRead: '$notifications.isRead',
              createdAt: '$notifications.createdAt',
              actor: { $arrayElemAt: ['$notifications.actor', 0] },
              post: { $arrayElemAt: ['$notifications.post', 0] },
              comment: { $arrayElemAt: ['$notifications.comment', 0] },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          avatarUrl: 1,
          notifications: 1,
        },
      },
    ];

    const result = await UserModel.aggregate(pipeline).exec();

    if (!result.length) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return result[0];
  }

  public async create(user: BaseUserReqDto): Promise<IUser> {
    const newUser = await UserModel.create(user);
    await newUser.save();
    return newUser.toJSON();
  }

  public async update(userId: string, dto: IUser): Promise<UserResDto> {
    return await UserModel.findByIdAndUpdate(userId, dto);

    // return await userRepository.updateById(userId, dto);
  }

  public async delete(userId: string): Promise<void> {
    await UserModel.findByIdAndDelete(userId);
    // await userRepository.deleteById(userId);
  }
}

export const userService = new UserService();
