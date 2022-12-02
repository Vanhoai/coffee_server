import { Controller, HttpStatus, Next, Post, Req, Res } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from 'src/utils/HttpResponse';
import { TokenService } from 'src/core/services/token.service';
import { JWTPayload } from 'src/core/interfaces/JWTPayload';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly JWT: TokenService) {}

    @Post('send')
    async sendMail(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json(HttpResponse.result('Bad Request', 400, {}));
            const response = await this.authService.sendMail({ email });
            if (!response) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Not found', HttpStatus.NOT_FOUND, {}));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Send mail successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Post('register')
    async register(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const { username, email, password, phone } = req.body;
            const user = await this.authService.register({ username, email, password, phone });
            if (!user) return res.status(409).json(HttpResponse.result('Conflict', 409, {}));
            return res.status(HttpStatus.OK).json(HttpResponse.result('User Register Successfully', 200, user));
        } catch (error: any) {
            next(error);
        }
    }

    @Post('admin')
    async createAdmin(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const { username, email, password, phone } = req.body;
            const user = await this.authService.createAdmin({ username, email, password, phone });
            if (!user) return res.status(409).json({ message: 'Conflict' });
            return res.status(HttpStatus.OK).json(HttpResponse.result('Admin Register Successfully', 200, user));
        } catch (error: any) {
            next(error);
        }
    }

    @Post('login')
    async login(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json(HttpResponse.result('Bad Request', 400, {}));
            const user = await this.authService.login({ email, password });
            if (!user) return res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.result('Unauthorized', 401, {}));
            return res.status(HttpStatus.OK).json(HttpResponse.result('User Login Successfully', 200, user));
        } catch (error: any) {
            next(error);
        }
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        try {
            const { refreshToken } = req.body;

            // const response = await this.authService.refreshToken(refreshToken);
            // if (!response)
            //     return res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.result('Unauthorized', 401, {}));

            const payload = await this.JWT.verifyRefreshToken(refreshToken);
            if (!payload) return res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.result('Unauthorized', 401, {}));
            const { id, email, role } = payload;

            const newPayload: JWTPayload = {
                id,
                email,
                role,
            };

            const accessToken = await this.JWT.signAccessToken(newPayload);
            const newRefreshToken = await this.JWT.signRefreshToken(newPayload);

            const response = {
                accessToken,
                refreshToken: newRefreshToken,
            };

            return res.status(HttpStatus.OK).json(HttpResponse.result('User Refresh Successfully', 200, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Post('reset')
    async resetPassword(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json(HttpResponse.result('Bad Request', 400, {}));
            const response = await this.authService.resetPassword({ email, password });
            if (!response) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Not found', HttpStatus.NOT_FOUND, {}));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Reset password successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }
}
