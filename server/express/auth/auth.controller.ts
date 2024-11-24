import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { SignInReqDto } from '../../models/dto/signIn.req.dto';
import { SignUpReqDto } from '../../models/dto/signUp.req.dto';
import { authService } from './auth.service';
import { IUser } from '../../models/interfaces/user.interface';
import { AuthResDto } from '../../models/dto/auth.res.dto';

class AuthController {
  public async signUp(req: Request, res: Response): Promise<Response<IUser>> {
    const dto = req.body as SignUpReqDto;
    const result = await authService.signUp(dto);
    return res.status(HttpStatus.CREATED).json(result);
  }

  public async signIn(
    req: Request,
    res: Response,
  ): Promise<Response<AuthResDto>> {
    const dto = req.body as SignInReqDto;
    const result = await authService.signIn(dto);
    return res.status(HttpStatus.OK).json(result);
  }

  public async logout(req: Request, res: Response): Promise<Response<void>> {
    return res.status(HttpStatus.NO_CONTENT);
  }
}

export const authController = new AuthController();
