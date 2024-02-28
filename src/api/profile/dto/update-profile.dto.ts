import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  birthday?: string;

  @IsInt()
  @IsOptional()
  height?: number;

  @IsInt()
  @IsOptional()
  weight?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];
}
