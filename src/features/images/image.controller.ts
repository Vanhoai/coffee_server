import { Controller, Get, HttpStatus, Next, Req, Res } from '@nestjs/common';
import { ImageService } from './image.service';
import { Request, Response, NextFunction } from 'express';

@Controller('images')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Get()
    async getAll(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const response = await this.imageService.find();
            return res.status(HttpStatus.OK).json(response);
        } catch (error: any) {
            next(error);
        }
    }

    @Get(':id')
    async getOne(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const response = await this.imageService.findOne(parseInt(id));
            return res.status(HttpStatus.OK).json(response);
        } catch (error: any) {
            next(error);
        }
    }
}
