import { Config } from './config.type';

export default (): Config => ({
  app: {
    nestPort: Number(process.env.APP_PORT_NEST) || 3000,
    expressPort: Number(process.env.APP_PORT_EXPRESS) || 3001,
    host: process.env.APP_HOST || 'localhost',
    appUrl: process.env.APP_URL || 'http://localhost:5173',
  },
  mongo: {
    mongoUrl: process.env.MONGO_URL,
  },

  postgres: {
    port: Number(process.env.POSTGRES_PORT),
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DB,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN),
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN),
  },
});
