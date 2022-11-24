import {
    Body,
    Controller,
    Delete,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { NextFunction, Request, Response } from 'express';
import { HttpResponse } from 'src/utils/HttpResponse';
import { CreateShopParams } from '../interfaces/CreateShopParams';
import { ShopService } from '../services/shop.service';

@Controller('shop')
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

    @Get(':id')
    async getShopById(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            if (!id)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Shop id is required', HttpStatus.BAD_REQUEST, {}));

            const response = await this.shopService.getShopById(parseInt(id));
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Shop not found', HttpStatus.NOT_FOUND, {}));
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Shop found successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Post()
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

    @Put(':id')
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

    @Delete(':id')
    async deleteSoftShop(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const response = await this.shopService.deleteSoftShop(parseInt(id));
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Shop not found', HttpStatus.NOT_FOUND, {}));
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Shop deleted successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Delete('delete/:id')
    async deleteShop(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const response = await this.shopService.removeShop(parseInt(id));
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Shop not found', HttpStatus.NOT_FOUND, {}));
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Shop deleted successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }
}
