import { Router } from 'express';

import { authMiddleware } from './../middlewares/auth.middleware';
import { authController } from './auth.controller';
import userValidationSchema from '../../validation/user.joi.schema';
import { tryCatch } from '../middlewares/tryCatch.middleware';
import { IUser } from '../../models/interfaces/user.interface';
import { commonMiddleware } from '../users/users.route';

const router = Router();

router.post(
  '/signup',
  commonMiddleware.isBodyValid(userValidationSchema.signUp),
  tryCatch(authController.signUp),
);
router.post(
  '/signin',
  commonMiddleware.isBodyValid(userValidationSchema.signIn),
  commonMiddleware.isExist<IUser>(['email', 'username']),
  tryCatch(authController.signIn),
);

router.get(
  '/logout',
  authMiddleware.authCheck,
  tryCatch(authController.logout),
);

export const authRouter = router;
