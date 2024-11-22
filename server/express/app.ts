import * as express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import * as cors from 'cors';

import { ConfigStaticService } from '../config/config-static';
import { myDataSource } from '../ormconfig';
import { userRouter } from './users/users.route';
import { authRouter } from './auth/auth.route';
import { ApiError } from './common/api-error';
import passport from './middlewares/passport';

export const config = ConfigStaticService.get();

const app = express();

const port = config.app.expressPort;
const host = config.app.host;
const mongoUrl = config.mongo.mongoUrl;

app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:5173',
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
// app.use("/posts", postRouter);

app.use('*', (err: ApiError, req: express.Request, res: express.Response) => {
  res.status(err.status || 500).json(err.message);
});

app.listen(port, host, async () => {
  await myDataSource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
    });
  await mongoose
    .connect(mongoUrl)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB:', err));
  console.log(`Express server is running on port ${port}`);
});
