import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CompanyIdParamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @Matches(/^[a-zA-Z0-9_-]+$/)
  id!: string;
}
