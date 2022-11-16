import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Next,
    Post,
    Put,
    Req,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ShopEntity } from '../entities/shop.entity';
import { ShopService } from '../services/shop.service';
import { Request, Response, NextFunction } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpResponse } from 'src/utils/HttpResponse';
import { CreateShopParams } from '../interfaces/CreateShopParams';

@Controller('shops')
export class ShopController {
    constructor(private readonly shopService: ShopService) {}

    @Get()
    async getAll(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const response = await this.shopService.getAllShop();
            return res.status(HttpStatus.OK).json(response);
        } catch (error: any) {
            next(error);
        }
    }

    @Post('create')
    @UseInterceptors(FileInterceptor('image'))
    async createShop(
        @Req() req: Request,
        @Res() res: Response,
        @Body() body: CreateShopParams,
        @Next() next: NextFunction,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        try {
            const response = await this.shopService.createShop({ ...body, file });
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Shop created successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Put('update/:id')
    @UseInterceptors(FileInterceptor('image'))
    async updateShop(
        @Req() req: Request,
        @Res() res: Response,
        @Body() body: CreateShopParams,
        @Next() next: NextFunction,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<any> {
        try {
            const { id } = req.params;
            const response = await this.shopService.updateShop(parseInt(id), { ...body, file });
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Shop not found', HttpStatus.NOT_FOUND, {}));
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Shop updated successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }
}
