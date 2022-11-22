import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTypeDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsNumber()
    percent: number;
}
