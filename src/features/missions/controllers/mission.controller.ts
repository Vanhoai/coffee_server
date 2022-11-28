import { ConsoleLogger, Controller, Delete, Get, HttpStatus, Next, Post, Req, Res } from '@nestjs/common';
import { MissionService } from '../services/mission.service';
import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from 'src/utils/HttpResponse';
import { IBaseParams } from 'src/core/interfaces/IBaseParams';

@Controller('mission')
export class MissionController {
    constructor(private readonly missionService: MissionService) {}

    @Get('information')
    async getInformationMission(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { skip, limit, field } = req.query as IBaseParams;
            const response = await this.missionService.getInformationMission({ skip: +skip, limit: +limit, field });
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Mission not found', HttpStatus.NOT_FOUND, {}));
            return res.status(HttpStatus.OK).json(HttpResponse.result('Get mission success', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Get()
    async getAllMission(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { skip, limit, field } = req.query as IBaseParams;
            const response = await this.missionService.getAllMission({ skip, limit, field });
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Mission not found', HttpStatus.NOT_FOUND, {}));
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Get all mission success', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Get('/:id')
    async getMission(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            if (!id)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Id is required', HttpStatus.BAD_REQUEST, {}));
            const response = await this.missionService.getMissionById(+id);
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Mission not found', HttpStatus.NOT_FOUND, {}));
            return res.status(HttpStatus.OK).json(HttpResponse.result('Get mission success', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Post()
    async createMission(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { mark, type, total, description } = req.body;
            if (!mark || !type || !total)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Mark and type are required', HttpStatus.BAD_REQUEST, {}));

            const response = await this.missionService.createMission({ mark, type, total, description });
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Mission not found', HttpStatus.NOT_FOUND, {}));

            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Create mission success', HttpStatus.OK, { ...response }));
        } catch (error: any) {
            next(error);
        }
    }

    @Post('register')
    async registerMission(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { userId, missionId } = req.body;
            if (!userId || !missionId)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('User id and mission id are required', HttpStatus.BAD_REQUEST, {}));

            const response = await this.missionService.registerMissionUser({ userId: +userId, missionId: +missionId });
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Mission not found', HttpStatus.NOT_FOUND, {}));
            return res.status(HttpStatus.OK).json(HttpResponse.result('Get mission success', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Post('update')
    async updateProgressMission(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { userId, missionId, current } = req.body;
            if (!userId || !missionId || !current)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('User id and mission id are required', HttpStatus.BAD_REQUEST, {}));

            const response = await this.missionService.updateMissionUser({
                userId: +userId,
                missionId: +missionId,
                current: +current,
            });
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Mission not found', HttpStatus.NOT_FOUND, {}));
            return res.status(HttpStatus.OK).json(HttpResponse.result('Get mission success', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Delete('/:id')
    async deleteMission(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            if (!id)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Id is required', HttpStatus.BAD_REQUEST, {}));
            const response = await this.missionService.deleteMission(+id);
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Mission not found', HttpStatus.NOT_FOUND, {}));
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Delete mission success', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }

    @Get('user/:id')
    async getInformationMissionAndUser(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
    ): Promise<any> {
        try {
            const { id } = req.params;
            const { skip, limit, field } = req.query as IBaseParams;
            if (!id)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Id is required', HttpStatus.BAD_REQUEST, {}));
            const response = await this.missionService.getInformationMissionUser(+id, { skip, limit, field });
            if (!response)
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json(HttpResponse.result('Mission not found', HttpStatus.NOT_FOUND, {}));
            return res.status(HttpStatus.OK).json(HttpResponse.result('Get mission success', HttpStatus.OK, response));
        } catch (error: any) {
            next(error);
        }
    }
}
