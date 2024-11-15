import { Router } from 'express';
import { userController } from './users.controller';

const router = Router();

router.get('/v1.1', userController.getList);

router.get('/v1.2', userController.getListQuery);

router.post('/', userController.createUser);

export const userRouter = router;
