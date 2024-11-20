import { authMiddleware } from './../middlewares/auth.middleware';
import { Router } from 'express';
import { authController } from './auth.controller';
import validationSchema from '../../validation/joi.schema';
import { tryCatch } from '../middlewares/tryCatch.middleware';
import { commonMiddleware } from '../middlewares/common.middleware';
import { User } from '../../models/entities/user.entity';
import { IUser } from '../../models/interfaces/user.interface';

const router = Router();

router.post(
  '/signup',
  commonMiddleware.isBodyValid(validationSchema.signUp),
  tryCatch(authController.signUp),
);
router.post(
  '/signin',
  commonMiddleware.isBodyValid(validationSchema.signIn),
  commonMiddleware.isExist<IUser>(User, ['email', 'username']),
  tryCatch(authController.signIn),
);

router.get('/logout', authMiddleware.authCheck, authController.logout);

export const authRouter = router;
