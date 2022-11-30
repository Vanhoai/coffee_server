import { Body, Controller, Delete, Get, HttpStatus, Next, Post, Put, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { HttpResponse } from 'src/utils/HttpResponse';
import { CreateOrderParams } from '../interfaces/CreateOrderParams';
import { OrderService } from '../services/order.service';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get('')
    async getAllOrder(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
        @Body() order: CreateOrderParams,
    ): Promise<any> {
        try {
            const response = await this.orderService.getAllOrder();
            if (!response) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Get all order fail', HttpStatus.BAD_REQUEST));
            }
            return res.status(HttpStatus.OK).json(HttpResponse.result('Get all order', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Get(':id')
    async getOrderById(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            if (!id) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Missing params', HttpStatus.BAD_REQUEST));
            }
            const response = await this.orderService.getOrderById(+id);
            if (!response) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Get order fail', HttpStatus.BAD_REQUEST));
            }
            return res.status(HttpStatus.OK).json(HttpResponse.result('Get order by id', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Post()
    async createOrder(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { user, address, shop, products, gift } = req.body;
            if (!user || !address || !shop || !products) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Missing params', HttpStatus.BAD_REQUEST));
            }
            const order = await this.orderService.createOrder({ user, address, products, shop, gifts: gift || -1 });
            if (!order) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Create order fail', HttpStatus.BAD_REQUEST));
            }
            return res.status(HttpStatus.OK).json(HttpResponse.result('Create order', HttpStatus.OK, order));
        } catch (error: any) {
            next(error);
        }
    }

    @Delete(':id')
    async deleteOrder(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const response = await this.orderService.deleteOrder(+id);
            if (!response) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Delete order fail', HttpStatus.BAD_REQUEST));
            }
            return res.status(HttpStatus.OK).json(HttpResponse.result('Delete order', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Put('update')
    async updateOrder(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { shop, product, order, type, count } = req.body;
            const response = await this.orderService.updateProductOfOrder({ shop, product, order, type, count });
            if (!response) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Update order fail', HttpStatus.BAD_REQUEST));
            }
            return res.status(HttpStatus.OK).json(HttpResponse.result('Update order', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Put(':id')
    async updateStatusOrder(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!status) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Missing params', HttpStatus.BAD_REQUEST));
            }
            const response = await this.orderService.updateStatusOrder({ id: +id, status });
            if (!response) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Update status order fail', HttpStatus.BAD_REQUEST));
            }
            return res.status(HttpStatus.OK).json(HttpResponse.result('Update status order', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Post('create')
    async createOrderWithProducts(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { user, address, shop, products, gift } = req.body;
            const response = await this.orderService.createOrder({ user, address, products, shop, gifts: gift || -1 });
            return res.status(HttpStatus.OK).json(HttpResponse.result('Create order', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }
}
