import { Controller, Delete, Get, HttpStatus, Next, Post, Put, Req, Res } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from 'src/utils/HttpResponse';
import { TypeService } from '../services/type.service';

@Controller('type')
export class TypeController {
    constructor(private readonly typeService: TypeService) {}

    @Get()
    async getAllType(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const response = await this.typeService.getAllType();
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Type not found', HttpStatus.NOT_FOUND, {}));
            return res.status(HttpStatus.OK).json(HttpResponse.result('Get all type success', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Get('/:id')
    async getTypeById(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            if (!id)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Id is required', HttpStatus.BAD_REQUEST, {}));
            const response = await this.typeService.getTypeById(+id);
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Type not found', HttpStatus.NOT_FOUND, {}));
            return res.status(HttpStatus.OK).json(HttpResponse.result('Get type success', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Post()
    async createType(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { percent } = req.body;
            if (!percent)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Name and percent is required', HttpStatus.BAD_REQUEST, {}));
            const response = await this.typeService.createType({ percent });
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Type not found', HttpStatus.NOT_FOUND, {}));
            return res.status(HttpStatus.OK).json(HttpResponse.result('Create type success', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Put('/:id')
    async updateType(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id, percent } = req.params;
            if (!id || !percent)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Id is required', HttpStatus.BAD_REQUEST, {}));
            const response = await this.typeService.updateType({ id: +id, percent: +percent });
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Type not found', HttpStatus.NOT_FOUND, {}));
            return res.status(HttpStatus.OK).json(HttpResponse.result('Update type success', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Delete('/:id')
    async deleteType(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            if (!id)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Id is required', HttpStatus.BAD_REQUEST, {}));
            const response = await this.typeService.deleteType(+id);
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Type not found', HttpStatus.NOT_FOUND, {}));
            return res.status(HttpStatus.OK).json(HttpResponse.result('Delete type success', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Put('/:id/restore')
    async restoreType(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            if (!id)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Id is required', HttpStatus.BAD_REQUEST, {}));
            const response = await this.typeService.restoreType(+id);
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Type not found', HttpStatus.NOT_FOUND, {}));
            return res.status(HttpStatus.OK).json(HttpResponse.result('Restore type success', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Delete('/:id/force')
    async forceDeleteType(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            if (!id)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Id is required', HttpStatus.BAD_REQUEST, {}));
            const response = await this.typeService.hardDeleteType(+id);
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Type not found', HttpStatus.NOT_FOUND, {}));
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Force delete type success', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }
}
