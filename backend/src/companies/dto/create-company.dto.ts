import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { trimString, trimToUndefined } from './transforms';

export class CreateCompanyDto {
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  companyName!: string;

  @Transform(({ value }) => trimToUndefined(value))
  @IsOptional()
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  @MaxLength(2048)
  website?: string;

  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  industry!: string;

  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === '' ? value : Number(value),
  )
  @IsInt()
  @Min(1)
  @Max(2_147_483_647)
  employeeCount!: number;
}
