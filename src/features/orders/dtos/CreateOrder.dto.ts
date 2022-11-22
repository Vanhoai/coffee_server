import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProductParams } from '../interfaces/ProductParam';

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsNumber()
    shop: number;

    @IsNotEmpty()
    @IsNumber()
    voucher?: number;

    @IsNotEmpty()
    @IsNumber()
    user: number;

    @IsNotEmpty()
    products: ProductParams[];
}
