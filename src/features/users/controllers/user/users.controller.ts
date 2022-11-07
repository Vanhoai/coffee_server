import { Controller, Get, Next, Req, Res, UseGuards } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Role } from 'src/core/constants/role.enum';
import { Roles } from 'src/core/decorators/roles.decorator';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { UserService } from '../../services/users.service';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('customers')
    async getAllCustomer(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const users = await this.userService.getAllCustomer();
            return res.status(200).json(users);
        } catch (error: any) {
            next(error);
        }
    }

    @Get()
    @Roles(Role.CUSTOMER)
    async getAllUser(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const users = await this.userService.getAllUser();
            return res.status(200).json(users);
        } catch (error: any) {
            next(error);
        }
    }
}
