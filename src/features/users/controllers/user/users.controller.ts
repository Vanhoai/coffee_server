import {
    Controller,
    Get,
    HttpStatus,
    Next,
    Patch,
    Post,
    Put,
    Req,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NextFunction, Request, Response } from 'express';
import { IBaseParams } from 'src/core/interfaces/IBaseParams';
import { HttpResponse } from 'src/utils/HttpResponse';
import { UserEntity } from '../../entities/user.entity';
import { UserService } from '../../services/users.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('customers')
    async getAllCustomer(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const users = await this.userService.getAllCustomer();
            if (!users) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Not found', HttpStatus.NOT_FOUND, {}));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Get all customer successfully', HttpStatus.OK, users));
        } catch (error: any) {
            next(error);
        }
    }

    @Get('balance/:id')
    async getBalanceOfUser(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const balance = await this.userService.getBalanceOfUser(+id);
            if (!balance) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Not found', HttpStatus.NOT_FOUND, {}));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Get balance of user successfully', HttpStatus.OK, balance));
        } catch (error: any) {
            next(error);
        }
    }

    @Get(':id')
    async getUserById(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(+id);
            if (!user) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Not found', HttpStatus.NOT_FOUND, {}));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Get user by id successfully', HttpStatus.OK, user));
        } catch (error: any) {
            next(error);
        }
    }

    @Get()
    async getAllUser(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const users = await this.userService.getAllUser();
            if (!users) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Not found', HttpStatus.NOT_FOUND, {}));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Get all user successfully', HttpStatus.OK, users));
        } catch (error: any) {
            next(error);
        }
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('image'))
    async uploadAvatar(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        try {
            const { id } = req.params;
            const user = await this.userService.uploadAvatar({ id: parseInt(id), file });
            if (!user) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Not found', HttpStatus.NOT_FOUND, {}));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Upload avatar successfully', HttpStatus.OK, user));
        } catch (error: any) {
            next(error);
        }
    }

    @Patch(':id')
    async updateBalance(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const { balance, code } = req.body;
            const response = await this.userService.updateBalance(+id, balance, code);
            if (!response) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Not found', HttpStatus.NOT_FOUND, {}));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Update balance successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Post('favorite/:id')
    async addProductToFavorite(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const { product } = req.body;
            const response = await this.userService.addProductToFavorite(+id, +product);
            if (!response) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Not found', HttpStatus.NOT_FOUND, {}));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Add product to favorite successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Get('gift/:id')
    async getGiftByUserId(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const { limit, skip, field } = req.query as IBaseParams;
            const response = await this.userService.getGiftOfUser(+id, { skip, limit, field });
            if (!response) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Not found', HttpStatus.NOT_FOUND, {}));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Get gift by user id successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Get('gift/:id/expire')
    async getGiftExpireByUserId(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const { limit, skip, field } = req.query as IBaseParams;
            const response = await this.userService.getGiftToExpire(+id, { skip, limit, field });
            if (!response) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Not found', HttpStatus.NOT_FOUND, {}));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Get gift expire by user id successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Put('update/:id')
    async updateUser(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const { phone } = req.body;
            if (!phone) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Bad request', HttpStatus.BAD_REQUEST, {}));
            }
            const response = await this.userService.updatePhoneNumberForUser({ id: +id, phone });
            if (!response) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Not found', HttpStatus.NOT_FOUND, {}));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Update user successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Put('token/:id')
    async updateDeviceToken(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const { token } = req.body;
            if (!token) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Bad request', HttpStatus.BAD_REQUEST, {}));
            }
            const response = await this.userService.updateDeviceTokenForUser({ id: +id, token });
            if (!response) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Not found', HttpStatus.NOT_FOUND, {}));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Update device token successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Post('information/:id')
    async updateUserInformation(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Bad request', HttpStatus.BAD_REQUEST, {}));
            }
            const response: UserEntity = await this.userService.updateUserInformation({
                id: +id,
                username,
                email,
                password,
            });
            if (!response) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Not found', HttpStatus.NOT_FOUND, {}));
            }

            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Update user information successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }
}
