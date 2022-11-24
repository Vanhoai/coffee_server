import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateHistoryDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    orderId: number;
}
