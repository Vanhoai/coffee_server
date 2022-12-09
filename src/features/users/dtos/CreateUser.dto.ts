import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateUserDto {
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @Expose()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    password: string;

    @IsNotEmpty()
    phone: string;
}
