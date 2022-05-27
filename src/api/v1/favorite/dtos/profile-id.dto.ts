import { IsMongoId } from 'class-validator';

export default class ProfileIdDto {
  @IsMongoId()
  public profile_id: string;
}
