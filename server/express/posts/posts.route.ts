import { Router } from 'express';
import { CommonMiddleware } from '../middlewares/common.middleware';
import { tryCatch } from '../middlewares/tryCatch.middleware';

import { authMiddleware } from '../middlewares/auth.middleware';
import { PostModel } from '../../models/schemas/post.schema';
import { IPost } from '../../models/interfaces/post.interface';
import postValidationSchema from '../../validation/post.joi.schema';
import { postController } from './posts.controller';

const router = Router();
export const commonMiddleware = new CommonMiddleware(PostModel);

router.get('/v1.1', tryCatch(postController.getList));

router.get('/v1.2', tryCatch(postController.getListQuery));

router.get(
  '/:id/v1.1',
  authMiddleware.authCheck,
  commonMiddleware.isExist<IPost>('id'),
  tryCatch(postController.getPostById),
);

router.get(
  '/:id/v1.2',
  authMiddleware.authCheck,
  commonMiddleware.isExist<IPost>('id'),
  tryCatch(postController.getPostByIdQuery),
);

router.post(
  '/',
  authMiddleware.authCheck,
  commonMiddleware.isBodyValid(postValidationSchema),
  tryCatch(postController.createPost),
);

router.put(
  '/:id',
  authMiddleware.authCheck,
  commonMiddleware.isBodyValid(postValidationSchema),
  commonMiddleware.isExist<IPost>('id'),
  tryCatch(postController.updatePost),
);
router.delete(
  '/:id',
  authMiddleware.authCheck,
  commonMiddleware.isExist<IPost>('id'),
  tryCatch(postController.deletePost),
);

export const postRouter = router;
