import { Body, Controller, Delete, Get, HttpStatus, Next, Post, Req, Res } from '@nestjs/common';
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
            const { user, address, shop, gifts, products } = req.body;
            if (!user || !address || !shop || !gifts || !products) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Missing params', HttpStatus.BAD_REQUEST));
            }
            const order = await this.orderService.createOrder({ user, address, gifts, products, shop });
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
}
