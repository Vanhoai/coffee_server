import { Controller, Delete, Get, HttpStatus, Next, Post, Req, Res } from '@nestjs/common';
import { GiftService } from '../services/gift.service';
import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from 'src/utils/HttpResponse';

@Controller('gift')
export class GiftController {
    constructor(private readonly giftService: GiftService) {}

    @Get()
    async getAllGifts(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const gifts = await this.giftService.getAllGifts();
            if (!gifts)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Get all gifts failed', HttpStatus.BAD_REQUEST, {}));

            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Get all gifts successfully', HttpStatus.OK, gifts));
        } catch (error) {
            next(error);
        }
    }

    @Get('/:id')
    async getGiftById(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            if (!id)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Get gift by id failed', HttpStatus.BAD_REQUEST, {}));
            const gift = await this.giftService.findGiftById(+id);
            if (!gift)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Get gift by id failed', HttpStatus.BAD_REQUEST, {}));
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Get gift by id successfully', HttpStatus.OK, gift));
        } catch (error) {
            next(error);
        }
    }

    @Post()
    async createGift(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { type, code, count, expiredAt, name } = req.body;
            if (!type || !code || !count || !expiredAt || !name)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Create gift failed', HttpStatus.BAD_REQUEST, {}));
            const gift = await this.giftService.createGift({ type, code, count, expiredAt, name });
            if (!gift) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Create gift failed', HttpStatus.BAD_REQUEST));
            }
            return res.status(HttpStatus.OK).json(HttpResponse.result('Create gift successfully', HttpStatus.OK, gift));
        } catch (error) {
            next(error);
        }
    }

    @Delete('/:id')
    async deleteGift(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            if (!id)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Delete gift failed', HttpStatus.BAD_REQUEST, {}));
            const gift = await this.giftService.deleteGift(+id);
            if (!gift) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Delete gift failed', HttpStatus.BAD_REQUEST));
            }
            return res.status(HttpStatus.OK).json(HttpResponse.result('Delete gift successfully', HttpStatus.OK, gift));
        } catch (error) {
            next(error);
        }
    }

    @Get('user/:id')
    async getGiftOfUser(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            if (!id)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Get gift of user failed', HttpStatus.BAD_REQUEST, {}));
            const gift = await this.giftService.getGiftOfUser(+id);
            if (!gift) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Get gift of user failed', HttpStatus.BAD_REQUEST));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Get gift of user successfully', HttpStatus.OK, gift));
        } catch (error) {
            next(error);
        }
    }
}
