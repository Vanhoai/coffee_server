import { Controller, Get, Next, Post, Req, Res } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ShopProductService } from '../services/shop-product.service';

@Controller('shop-product')
export class ShopProductController {
    constructor(private readonly shopProductService: ShopProductService) {}

    @Get(':id')
    async getAllProductFromShop(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const response = await this.shopProductService.getAllProductFromShop(parseInt(id));
            return res.status(200).json(response);
        } catch (error: any) {
            next(error);
        }
    }

    @Post()
    async addProductToShop(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { shop, product, quantity } = req.body;
            const response = await this.shopProductService.addProductToShop({ shop, product, quantity });
            return res.status(200).json(response);
        } catch (error: any) {
            next(error);
        }
    }
}
