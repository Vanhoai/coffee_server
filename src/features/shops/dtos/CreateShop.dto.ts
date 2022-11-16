import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateShopDto {
    @IsNotEmpty()
    @IsString()
    location: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    longitude: number;

    @IsNotEmpty()
    @IsNumber()
    latitude: number;

    @IsNotEmpty()
    file: Express.Multer.File;
}
