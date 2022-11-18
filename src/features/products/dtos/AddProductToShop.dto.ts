import { IsNumber, Min } from 'class-validator';

export class AddProductToShopDto {
    @IsNumber()
    product: number;

    @IsNumber()
    shop: number;

    @IsNumber()
    @Min(1)
    quantity: number;
}
