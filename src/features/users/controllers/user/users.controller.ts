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
import { HttpResponse } from 'src/utils/HttpResponse';
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
}
