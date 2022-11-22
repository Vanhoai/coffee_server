import { Controller, Delete, Get, HttpStatus, Next, Post, Req, Res } from '@nestjs/common';
import { ProductService } from 'src/features/products/services/product.service';
import { UserService } from 'src/features/users/services/users.service';
import { HistoryService } from '../services/history.service';
import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from 'src/utils/HttpResponse';

@Controller('histories')
export class HistoryController {
    constructor(
        private readonly historyService: HistoryService,
        private readonly productService: ProductService,
        private readonly userService: UserService,
    ) {}

    @Get()
    async getAllHistories(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const histories = await this.historyService.getAllHistory();
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Get all histories successfully', HttpStatus.OK, histories));
        } catch (error) {
            next(error);
        }
    }

    @Get('/:id')
    async getHistoryById(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const history = await this.historyService.getHistoryById(+id);
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Get history by id successfully', HttpStatus.OK, history));
        } catch (error) {
            next(error);
        }
    }

    @Post()
    async createHistory(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { imageId, orderId, userId } = req.body;
            const history = await this.historyService.createHistory({ imageId, orderId, userId });
            if (!history) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Create history failed', HttpStatus.BAD_REQUEST));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Create history successfully', HttpStatus.OK, history));
        } catch (error) {
            next(error);
        }
    }

    @Delete('/:id')
    async deleteHistory(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const history = await this.historyService.deleteHistory(+id);
            if (!history) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Delete history failed', HttpStatus.BAD_REQUEST));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Delete history successfully', HttpStatus.OK, history));
        } catch (error) {
            next(error);
        }
    }
}
