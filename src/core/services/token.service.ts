import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getConfig } from 'src/config';
import { JWTPayload } from '../interfaces/JWTPayload';

@Injectable()
export class TokenService {
    constructor(private JWT: JwtService) {}

    signAccessToken = (payload: JWTPayload): Promise<string> => {
        return new Promise((resolve, reject) => {
            const secret = process.env.ACCESS_TOKEN_SECRET || getConfig().ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: '1h',
                secret,
            };
            try {
                const token = this.JWT.sign(payload, options);
                resolve(token);
            } catch (error: any) {
                reject(error);
            }
        });
    };

    signRefreshToken = (payload: JWTPayload): Promise<string> => {
        return new Promise((resolve, reject) => {
            const secret = process.env.REFRESH_TOKEN_SECRET || getConfig().REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: '1y',
                secret,
            };
            try {
                const token = this.JWT.sign(payload, options);
                resolve(token);
            } catch (error: any) {
                reject(error);
            }
        });
    };

    async verifyAccessToken(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const secret = process.env.ACCESS_TOKEN_SECRET || getConfig().ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: '1h',
                secret,
            };
            try {
                const payload = this.JWT.verify(token, options);
                resolve(payload);
            } catch (error: any) {
                reject(error);
            }
        });
    }

    async verifyRefreshToken(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const secret = process.env.REFRESH_TOKEN_SECRET || getConfig().REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: '1y',
                secret,
            };
            try {
                const payload = this.JWT.verify(token, options);
                resolve(payload);
            } catch (error: any) {
                reject(error);
            }
        });
    }
}
