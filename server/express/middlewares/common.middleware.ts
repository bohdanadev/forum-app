import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { HttpStatus } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { DataSource, EntityTarget } from 'typeorm';
import { ApiError } from '../common/api-error';
import { myDataSource } from '../../ormconfig';

interface CustomRequest extends Request {
  entity?: any;
}

export class CommonMiddleware {
  // constructor(private readonly dataSource: DataSource) {}
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

  // public isExist<T>(entityClass: EntityTarget<T>, field: keyof T | any) {
  //   return async (req: CustomRequest, res: Response, next: NextFunction) => {
  //     try {
  //       const repository = this.dataSource.getRepository(entityClass);

  //       let entity;
  //       if (req.params.id) {
  //         entity = await repository.findOneBy({ id: req.params.id } as any);
  //       } else if (field && req.body.identifier) {
  //         const whereClause = field.map((field: keyof T) => ({
  //           [field]: req.body.identifier,
  //         }));

  //         entity = await repository.findOne({
  //           where: whereClause,
  //         } as any);
  //       } else if (field && req.body[field]) {
  //         entity = await repository.findOneBy({
  //           [field]: req.body[field],
  //         } as any);
  //       }

  //       if (!entity) {
  //         return res
  //           .status(HttpStatus.NOT_FOUND)
  //           .json({ message: 'Entity not found' });
  //       }

  //       req.entity = entity;

  //       next();
  //     } catch (e) {
  //       next(e);
  //     }
  //   };
  // }

  public isExist<T>(field?: keyof T | string[] | any) {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        let entity;

        // Case 1: Find by ID in the request params
        if (req.params.id) {
          entity = await this.model.findById(req.params.id).exec();
        }
        // Case 2: Find by multiple fields matching the `identifier`
        else if (field && req.body.identifier) {
          const whereClause = field.map((field: keyof T) => ({
            [field]: req.body.identifier,
          }));

          entity = await this.model.findOne({ $or: whereClause }).exec();
        }
        // Case 3: Find by a specific field in the body
        else if (field && req.body[field as keyof T]) {
          entity = await this.model
            .findOne({ [field as keyof T]: req.body[field as keyof T] })
            .exec();
        }

        // If the entity doesn't exist, return a 404 response
        if (!entity) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ message: 'Entity not found' });
        }

        // Attach the entity to the request object for downstream use
        req.entity = entity;

        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

//export const commonMiddleware = new CommonMiddleware(myDataSource);
