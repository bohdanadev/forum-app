import { Router } from 'express';
import { userController } from './users.controller';
import { commonMiddleware } from '../middlewares/common.middleware';
import validationSchema from '../../validation/joi.schema';
import { tryCatch } from '../middlewares/tryCatch.middleware';
import { User } from '../../models/entities/user.entity';
import { IUser } from '../../models/interfaces/user.interface';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/v1.1', tryCatch(userController.getList));

router.get('/v1.2', tryCatch(userController.getListQuery));

router.get(
  '/v1.1',
  authMiddleware.authCheck,
  commonMiddleware.isExist<IUser>(User, 'id'),
  tryCatch(userController.getUserById),
);

router.get(
  '/v1.2',
  authMiddleware.authCheck,
  commonMiddleware.isExist<IUser>(User, 'id'),
  tryCatch(userController.getUserByIdQuery),
);

router.put(
  '/',
  authMiddleware.authCheck,
  commonMiddleware.isBodyValid(validationSchema.update),
  commonMiddleware.isExist<IUser>(User, 'username'),
  tryCatch(userController.updateUserData),
);
router.delete(
  '/',
  authMiddleware.authCheck,
  commonMiddleware.isExist<IUser>(User, 'username'),
  tryCatch(userController.deleteUserProfile),
);

export const userRouter = router;
