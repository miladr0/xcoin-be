import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export default class GetAllDocsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  public limit: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  public page: number;
}
