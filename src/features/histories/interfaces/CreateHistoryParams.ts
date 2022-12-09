import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateHistoryParams {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    orderId: number;

    @IsNumber()
    imageId: number;
}
