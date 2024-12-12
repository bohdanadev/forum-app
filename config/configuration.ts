import { Config } from './config.type';

export default (): Config => ({
  app: {
    port: Number(process.env.PORT),
    expressPort: Number(process.env.APP_PORT_EXPRESS),
    host: process.env.APP_HOST,
    appUrl: process.env.APP_URL,
    originUrl: process.env.CORS_ORIGINS,
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
    dbUrl: process.env.DATABASE_URL,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN),
  },
});
