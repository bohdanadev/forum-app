import { Router } from 'express';

import { userController } from './users.controller';
import userValidationSchema from '../../validation/user.joi.schema';
import { tryCatch } from '../middlewares/tryCatch.middleware';
import { IUser } from '../../models/interfaces/user.interface';
import { authMiddleware } from '../middlewares/auth.middleware';
import { CommonMiddleware } from '../middlewares/common.middleware';
import { UserModel } from '../../models/schemas/user.schema';

const router = Router();
export const commonMiddleware = new CommonMiddleware(UserModel);

router.get(
  '/v1.1/:id',
  authMiddleware.authCheck,
  commonMiddleware.isExist<IUser>('id'),
  tryCatch(userController.getUserById),
);

router.get(
  '/v1.2/:id',
  authMiddleware.authCheck,
  commonMiddleware.isExist<IUser>('id'),
  tryCatch(userController.getUserByIdQuery),
);

router.put(
  '/',
  authMiddleware.authCheck,
  commonMiddleware.isBodyValid(userValidationSchema.update),
  tryCatch(userController.updateUserData),
);
router.delete(
  '/',
  authMiddleware.authCheck,
  tryCatch(userController.deleteUserProfile),
);

export const userRouter = router;
