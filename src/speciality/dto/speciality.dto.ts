import { IsNotEmpty, IsString } from 'class-validator';

export class SpecialityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  nameArabic: string;
}
