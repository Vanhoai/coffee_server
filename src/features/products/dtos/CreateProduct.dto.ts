import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNotEmpty()
    image: Express.Multer.File;
}
