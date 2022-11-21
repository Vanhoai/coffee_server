import { Controller, Get, HttpStatus, Next, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { IBaseParams } from 'src/core/interfaces/IBaseParams';
import { HttpResponse } from 'src/utils/HttpResponse';
import { ProductsService } from '../services/products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get('all')
    async getAll(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const response = await this.productsService.getAllProduct();
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Shops found successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Get('')
    async getProducts(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { limit, skip, sort, field } = req.query as IBaseParams;
            const response = await this.productsService.getProductByOptions({ limit, skip, sort, field });
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Shops found successfully', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }
}
