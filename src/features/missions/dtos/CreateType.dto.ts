import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTypeDto {
    @IsNotEmpty()
    @IsString()
    percent: number;
}
