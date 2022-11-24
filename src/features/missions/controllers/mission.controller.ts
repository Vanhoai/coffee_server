import { Controller, Get, HttpStatus, Next, Post, Req, Res } from '@nestjs/common';
import { MissionService } from '../services/mission.service';
import { Request, Response, NextFunction } from 'express';
import { HttpResponse } from 'src/utils/HttpResponse';

@Controller('mission')
export class MissionController {
    constructor(private readonly missionService: MissionService) {}

    @Get()
    async getAllMission(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const response = await this.missionService.getAllMission();
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
            const { mark, type, total } = req.body;
            if (!mark || !type || !total)
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Mark and type are required', HttpStatus.BAD_REQUEST, {}));

            const response = await this.missionService.createMission({ mark, type, total });
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
}
