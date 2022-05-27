import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export default class CreateSimulatorDto {
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  public dateRecorded: Date;

  @IsNotEmpty()
  @IsString()
  public cryptocurrency: string;

  @IsNotEmpty()
  @IsString()
  public euros: string;

  @IsNotEmpty()
  @IsString()
  public price: string;

  @IsNotEmpty()
  @IsString()
  public quantity: string;
}
