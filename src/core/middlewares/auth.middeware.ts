import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { HttpResponse } from 'src/utils/HttpResponse';
import { JWTPayload } from '../interfaces/JWTPayload';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly tokenService: TokenService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const authorization = req.headers['authorization'];
        const token = authorization.split(' ')[1];
        this.tokenService
            .verifyAccessToken(token)
            .then((payload: JWTPayload) => {
                req.body.user = payload;
                next();
            })
            .catch((error: any) => {
                return res.status(HttpStatus.UNAUTHORIZED).json(HttpResponse.result('Unauthorized', 401, error));
            });
    }
}
