import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @IsNotEmpty()
    @IsNumber()
    rating: number;

    @IsNotEmpty()
    @IsString()
    content: string;
}
