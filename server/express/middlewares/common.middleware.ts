import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { HttpStatus } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { ApiError } from '../api-error/api-error';

interface CustomRequest extends Request {
  entity?: any;
}

export class CommonMiddleware {
  constructor(private readonly model: Model<any>) {}

  public isBodyValid(validator: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = await validator.validateAsync(req.body);
        next();
      } catch (e) {
        next(new ApiError(e.details[0].message, HttpStatus.BAD_REQUEST));
      }
    };
  }

  public isExist<T>(field?: keyof T | string[] | any) {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        let entity;

        if (req.params.id) {
          entity = await this.model.findById(req.params.id).exec();
        } else if (field && req.body.identifier) {
          const whereClause = field.map((field: keyof T) => ({
            [field]: req.body.identifier,
          }));

          entity = await this.model.findOne({ $or: whereClause }).exec();
        } else if (field && req.body[field as keyof T]) {
          entity = await this.model
            .findOne({ [field as keyof T]: req.body[field as keyof T] })
            .exec();
        }

        if (!entity) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ message: 'Entity not found' });
        }

        req.entity = entity;

        next();
      } catch (e) {
        next(e);
      }
    };
  }
}
