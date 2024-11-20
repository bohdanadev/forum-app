import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import { IJwtPayload } from '../models/interfaces/token-payload.interface';
import { config } from '../express/app';

export const generateAccessToken = async (
  payload: IJwtPayload,
): Promise<string> => {
  const accessToken = jsonwebtoken.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  });

  return accessToken;
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
