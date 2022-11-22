import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMissionDto {
    @IsNotEmpty()
    @IsNumber()
    mark: number;

    @IsNotEmpty()
    @IsNumber()
    type: number;
}
