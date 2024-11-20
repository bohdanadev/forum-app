import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { DataSource, EntityTarget } from 'typeorm';
import { ApiError } from '../common/api-error';
import { myDataSource } from '../../ormconfig';

interface CustomRequest extends Request {
  entity?: any;
}

class CommonMiddleware {
  constructor(private readonly dataSource: DataSource) {}
  public isBodyValid(validator: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = await validator.validateAsync(req.body);
        next();
      } catch (e) {
        next(new ApiError(e.details[0].message, 400));
      }
    };
  }

  public isExist<T>(entityClass: EntityTarget<T>, field: keyof T | any) {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const repository = this.dataSource.getRepository(entityClass);

        let entity;
        if (req.params.id) {
          entity = await repository.findOneBy({ id: req.params.id } as any);
        } else if (field && req.body.identifier) {
          const whereClause = field.map((field: keyof T) => ({
            [field]: req.body.identifier,
          }));

          entity = await repository.findOne({
            where: whereClause,
          } as any);
        } else if (field && req.body[field]) {
          entity = await repository.findOneBy({
            [field]: req.body[field],
          } as any);
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

export const commonMiddleware = new CommonMiddleware(myDataSource);
