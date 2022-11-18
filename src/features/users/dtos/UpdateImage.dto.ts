import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateImageDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    file: Express.Multer.File;
}
