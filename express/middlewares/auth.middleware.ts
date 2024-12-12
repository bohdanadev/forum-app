import { HttpStatus } from '@nestjs/common';

import passport from './passport';

import { Request, Response, NextFunction } from 'express';

class AuthMiddleware {
  public authCheck(req: Request, res: Response, next: NextFunction): void {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }
      req.user = user;
      console.log('REQ.USER', req.user);
      next();
    })(req, res, next);
  }
}

export const authMiddleware = new AuthMiddleware();
