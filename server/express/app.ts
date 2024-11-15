import * as express from 'express';
import mongoose from 'mongoose';

import { ConfigStaticService } from '../config/config-static';
import { myDataSource } from '../ormconfig';
import { userRouter } from './users/users.route';

const config = ConfigStaticService.get();

const app = express();

const port = config.app.expressPort;
const host = config.app.host;
const mongoUrl = config.mongo.mongoUrl;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/auth", authRouter);
app.use('/api/users', userRouter);
// app.use("/posts", postRouter);

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
