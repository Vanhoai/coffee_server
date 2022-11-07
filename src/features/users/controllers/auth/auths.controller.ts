import { Controller, HttpStatus, Next, Post, Req, Res } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import e, { Request, Response, NextFunction } from 'express';
import { HttpResponse } from 'src/utils/HttpResponse';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const { username, email, password } = req.body;
            const user = await this.authService.register({ username, email, password });
            if (!user) return res.status(409).json({ message: 'Conflict' });
            return res.status(HttpStatus.OK).json(HttpResponse.result('User Register Successfully', 200, user));
        } catch (error: any) {
            next(error);
        }
    }

    @Post('admin')
    async createAdmin(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const { username, email, password } = req.body;
            const user = await this.authService.createAdmin({ username, email, password });
            if (!user) return res.status(409).json({ message: 'Conflict' });
            return res.status(HttpStatus.OK).json(HttpResponse.result('Admin Register Successfully', 200, user));
        } catch (error: any) {
            next(error);
        }
    }

    @Post('login')
    async login(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const { username, email, password } = req.body;
            const user = await this.authService.login({ username, email, password });
            if (!user) return res.status(401).json({ message: 'Unauthorized' });
            return res.status(HttpStatus.OK).json(HttpResponse.result('User Login Successfully', 200, user));
        } catch (error: any) {
            next(error);
        }
    }
}
