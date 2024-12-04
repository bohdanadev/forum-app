import mongoose from 'mongoose';
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

export const transformObjectIdRecursive = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(transformObjectIdRecursive);
  }

  if (obj && typeof obj === 'object') {
    const transformed: Record<string, any> = {};

    for (const key in obj) {
      if (key === '_id') {
        transformed['id'] = obj[key].toString();
      } else if (mongoose.isValidObjectId(obj[key])) {
        transformed[key] = obj[key].toString();
      } else if (Array.isArray(obj[key])) {
        transformed[key] = obj[key].map(transformObjectIdRecursive);
      } else if (obj[key] && typeof obj[key] === 'object') {
        transformed[key] = transformObjectIdRecursive(obj[key]);
      } else {
        transformed[key] = obj[key];
      }
    }

    return transformed;
  }

  return obj;
};
