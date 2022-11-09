import { Controller, Get, HttpStatus, Next, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PublicUserService } from '../services/user.public.service';

@Controller('public/users')
export class PublicUserController {
    constructor(private readonly userService: PublicUserService) {}

    @Get()
    async getAll(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const users = await this.userService.getAll();
            return res.status(HttpStatus.OK).json(users);
        } catch (error: any) {
            next(error);
        }
    }
}
