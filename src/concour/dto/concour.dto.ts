import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ConcourDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsNotEmpty()
  description: string;
  @IsDateString()
  @IsOptional()
  closingDate: Date;

  @IsArray()
  @ArrayNotEmpty()
  specialities: string[];
}
