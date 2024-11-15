// import * as path from 'node:path';

import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import getter from './config/configuration';

dotenv.config({ path: './environments/local.env' });

const databaseConfig = getter().postgres;

export const myDataSource = new DataSource({
  type: 'postgres',
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.dbName,
  entities: [__dirname + '/models/entities/*.entity.{ts,js}'],
  //   migrations: [
  //     path.join(process.cwd(), 'src', 'database', 'migrations', '*.ts'),
  //   ],
  synchronize: true,
});
