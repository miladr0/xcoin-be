import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export default class findOrCreateDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public nickname: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsOptional()
  @IsString()
  capital?: string;

  @IsOptional()
  @IsString()
  divisa: string;

  @IsOptional()
  @IsString()
  prefered_cryptocurrency: string;
}
