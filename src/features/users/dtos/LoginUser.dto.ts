import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
    @IsString()
    @IsEmail()
    @Expose()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    password: string;
}
