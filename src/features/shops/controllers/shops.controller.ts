import { Controller, Get, HttpStatus, Next, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { IBaseParams } from 'src/core/interfaces/IBaseParams';
import { HttpResponse } from 'src/utils/HttpResponse';
import { ShopsService } from '../services/shops.service';

@Controller('shops')
export class ShopsController {
    constructor(private readonly shopsService: ShopsService) {}

    @Get('all')
    async getAll(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const response = await this.shopsService.getAllShop();
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Shops found successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Get('')
    async getShops(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { limit, skip, sort, field } = req.query as IBaseParams;
            const response = await this.shopsService.getShopByOptions({ limit, skip, sort, field });
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Shops found successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Get(':id')
    async getAllProductOfShop(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const response = await this.shopsService.getAllProductOfShop(parseInt(id));
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Products found successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }
}
