import {
    Controller,
    Get,
    HttpStatus,
    Next,
    Put,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NextFunction, Request, Response } from 'express';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { UserService } from '../../services/users.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('customers')
    async getAllCustomer(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const users = await this.userService.getAllCustomer();
            return res.status(HttpStatus.OK).json(users);
        } catch (error: any) {
            next(error);
        }
    }

    @Get()
    async getAllUser(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const users = await this.userService.getAllUser();
            return res.status(HttpStatus.OK).json(users);
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
            return res.status(HttpStatus.OK).json(user);
        } catch (error: any) {
            next(error);
        }
    }
}
