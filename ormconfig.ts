import * as path from 'node:path';

import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import getter from './config/configuration';

dotenv.config({ path: './environments/local.env' });

const databaseConfig = getter().postgres;

export const myDataSource = new DataSource({
  type: 'postgres',
  // host: databaseConfig.host,
  // port: databaseConfig.port,
  // username: databaseConfig.user,
  // password: databaseConfig.password,
  // database: databaseConfig.dbName,
  url: databaseConfig.dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [path.join(__dirname, '**', '**', '*.entity.{ts,js}')],
  migrations: [path.join(__dirname, 'src', 'migrations', '*.{ts,js}')],
  synchronize: false,
});
