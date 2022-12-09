import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMissionParams {
    @IsNotEmpty()
    @IsNumber()
    mark: number;

    @IsNotEmpty()
    @IsNumber()
    type: number;
}
