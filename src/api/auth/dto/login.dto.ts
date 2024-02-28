import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @MinLength(8, {
    message: 'password must be longer than or equal to 8 characters',
  })
  @IsNotEmpty()
  password: string;
}
