import { Body, Controller, Get, HttpStatus, Next, Post, Req, Res } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AddProductToShopDto } from 'src/features/products/dtos/AddProductToShop.dto';
import { HttpResponse } from 'src/utils/HttpResponse';
import { ShopProductService } from '../services/shop-product.service';

@Controller('shop-product')
export class ShopProductController {
    constructor(private readonly shopProductService: ShopProductService) {}

    @Get(':id')
    async getAllProductFromShop(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const response = await this.shopProductService.getProductFromShop(parseInt(id));
            if (!response) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Bad Request', HttpStatus.BAD_REQUEST, {}));
            }
            return res.status(HttpStatus.OK).json(HttpResponse.result('Success', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Post()
    async addProductToShop(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
        @Body() body: AddProductToShopDto,
    ): Promise<any> {
        try {
            const { shop, product, quantity } = body;
            const response = await this.shopProductService.addProductToShop({ shop, product, quantity });
            if (!response)
                return res.status(HttpStatus.BAD_REQUEST).json(HttpResponse.result('Bad Request', 400, null));
            return res.status(HttpStatus.OK).json(HttpResponse.result('Add Product To Shop Success', 200, {}));
        } catch (error: any) {
            next(error);
        }
    }

    @Get()
    async getAllShopProduct(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const response = await this.shopProductService.getAll();
            return res.status(HttpStatus.OK).json(HttpResponse.result('Success', 200, response));
        } catch (error: any) {
            next(error);
        }
    }
}
