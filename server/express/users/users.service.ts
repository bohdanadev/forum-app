import * as mongoose from 'mongoose';
import { HttpStatus } from '@nestjs/common';

import { UserModel } from '../../models/schemas/user.schema';
import { ApiError } from '../common/api-error';
import { IUser } from '../interfaces/user/user.interface';
import { ISignIn } from '../interfaces/auth/signin.interface';
import { IUserRes } from '../interfaces/auth/auth.res.interface';
import { ISignUp } from '../interfaces/auth/signup.interface';

class UserService {
  async getByParamsQuery(dto: ISignIn): Promise<IUserRes> {
    const existingUser = await UserModel.findOne({
      $or: [{ email: dto.identifier }, { username: dto.identifier }],
    });

    if (existingUser && (await existingUser.comparePassword(dto.password))) {
      return existingUser.toJSON() as IUserRes;
    } else {
      throw new ApiError(`Wrong credentials`, HttpStatus.BAD_REQUEST);
    }
  }

  public async getById(userId: string): Promise<IUserRes> {
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
    const transformedUser = {
      ...user.toObject(),
      id: user._id.toString(),
    };
    delete transformedUser._id;
    delete transformedUser.password;
    return transformedUser as IUserRes;
  }

  public async getByIdQuery(userId: string): Promise<IUserRes> {
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
        $addFields: {
          'notifications.actor': { $arrayElemAt: ['$notifications.actor', 0] },
          'notifications.post': { $arrayElemAt: ['$notifications.post', 0] },
          'notifications.comment': {
            $arrayElemAt: ['$notifications.comment', 0],
          },
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
              actor: '$notifications.actor',
              post: '$notifications.post',
              comment: '$notifications.comment',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
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
    const user = result[0];

    return user as IUserRes;
  }

  public async create(user: ISignUp): Promise<IUserRes> {
    const newUser = await UserModel.create(user);
    await newUser.save();
    const userJson = newUser.toJSON() as IUserRes;
    return userJson;
  }

  public async update(userId: string, dto: IUser): Promise<IUserRes> {
    return await UserModel.findByIdAndUpdate(userId, dto);
  }

  public async delete(userId: string): Promise<void> {
    await UserModel.findByIdAndDelete(userId);
  }
}

export const userService = new UserService();
