export type Config = {
  app: AppConfig;
  mongo: MongoConfig;
  postgres: PostgresConfig;
  jwt: JwtConfig;
};
export type AppConfig = {
  nestPort: number;
  expressPort: number;
  host: string;
  appUrl: string;
};
export type MongoConfig = {
  mongoUrl: string;
};
export type PostgresConfig = {
  port: number;
  host: string;
  user: string;
  password: string;
  dbName: string;
};
export type JwtConfig = {
  accessSecret: string;
  accessExpiresIn: number;
  refreshSecret: string;
  refreshExpiresIn: number;
};
