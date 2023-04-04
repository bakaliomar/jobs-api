import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumberString,
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
  @IsNotEmpty()
  closingDate: Date;

  @IsDateString()
  @IsNotEmpty()
  concourDate: Date;

  @IsBoolean()
  @IsOptional()
  closed: boolean;

  @IsNumberString()
  @IsNotEmpty()
  positionsNumber: number;

  @IsNotEmpty()
  specialities: string[];
}
