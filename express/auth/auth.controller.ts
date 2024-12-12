import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { authService } from './auth.service';
import { ISignUp } from '../interfaces/auth/signup.interface';
import { IAuthResponse, IUserRes } from '../interfaces/auth/auth.res.interface';
import { ISignIn } from '../interfaces/auth/signin.interface';

class AuthController {
  public async signUp(
    req: Request,
    res: Response,
  ): Promise<Response<IUserRes>> {
    const dto = req.body as ISignUp;
    const result = await authService.signUp(dto);
    return res.status(HttpStatus.CREATED).json(result);
  }

  public async signIn(
    req: Request,
    res: Response,
  ): Promise<Response<IAuthResponse>> {
    const dto = req.body as ISignIn;
    const result = await authService.signIn(dto);
    return res.status(HttpStatus.OK).json(result);
  }

  public async logout(req: Request, res: Response): Promise<Response<void>> {
    return res.status(HttpStatus.NO_CONTENT);
  }
}

export const authController = new AuthController();
