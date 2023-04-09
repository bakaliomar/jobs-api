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

export class UpdateConcourDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  @IsOptional()
  closingDate: Date;

  @IsDateString()
  @IsOptional()
  concourDate: Date;

  @IsBoolean()
  @IsOptional()
  closed: boolean;

  @IsNumberString()
  @IsOptional()
  positionsNumber: number;

  @IsOptional()
  specialities: string[];
}
