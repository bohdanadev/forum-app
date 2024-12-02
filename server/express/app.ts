import * as express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import * as cors from 'cors';

import { ConfigStaticService } from '../config/config-static';
import { myDataSource } from '../ormconfig';
import { userRouter } from './users/users.route';
import { authRouter } from './auth/auth.route';
import { postRouter } from './posts/posts.route';
import { ApiError } from './common/api-error';
import passport from './middlewares/passport';
import { HttpStatus } from '@nestjs/common';

export const config = ConfigStaticService.get();

const app = express();

const port = config.app.expressPort;
const host = config.app.host;
const clientUrl = config.app.appUrl;
const mongoUrl = config.mongo.mongoUrl;

app.use(helmet());
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);

app.use(
  (
    err: ApiError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    res
      .status(err.status || HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: err.message || 'Internal Server Error' });
  },
);

// app.listen(port, host, async () => {
//   await myDataSource
//     .initialize()
//     .then(() => {
//       console.log('Data Source has been initialized!');
//     })
//     .catch((err) => {
//       console.error('Error during Data Source initialization:', err);
//     });
//   await mongoose
//     .connect(mongoUrl)
//     .then(() => console.log('Connected to MongoDB'))
//     .catch((err) => console.error('Could not connect to MongoDB:', err));
//   console.log(`Express server is running on port ${port}`);
// });
