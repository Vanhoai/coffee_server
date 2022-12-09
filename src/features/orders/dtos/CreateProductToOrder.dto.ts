import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductToOrderDto {
    @IsNotEmpty()
    @IsNumber()
    orderId: number;

    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsNotEmpty()
    @IsNumber()
    count: number;

    @IsNotEmpty()
    shopId: number;
}
