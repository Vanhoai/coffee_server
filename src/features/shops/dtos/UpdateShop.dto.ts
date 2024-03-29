import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateShopDto {
    @IsString()
    @IsNotEmpty()
    location?: string;

    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    longitude?: number;

    @IsNumber()
    @IsNotEmpty()
    latitude?: number;

    @IsNotEmpty()
    file?: Express.Multer.File;
}
