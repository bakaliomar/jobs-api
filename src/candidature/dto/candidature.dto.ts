import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CandidatureDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  cin: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  firstNameArabic: string;

  @IsString()
  @IsOptional()
  lastNameArabic: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: Date;

  @IsString()
  @IsNotEmpty()
  birthPlace: string;

  @IsString()
  @IsNotEmpty()
  birthPlaceArabic: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  addressArabic: string;

  @IsString()
  @IsNotEmpty()
  codePostal: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  cityArabic: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  currentJob: string;

  @IsNumberString()
  @IsNotEmpty()
  graduationYear: number;

  @IsString()
  @IsNotEmpty()
  graduationCountry: string;

  @IsString()
  @IsNotEmpty()
  establishment: string;

  @IsString()
  @IsNotEmpty()
  establishmentName: string;

  @IsString()
  @IsNotEmpty()
  degreeLevel: string;

  @IsString()
  @IsNotEmpty()
  degreeSpeciality: string;

  @IsString()
  @IsNotEmpty()
  degreeTitle: string;

  @IsString()
  @IsNotEmpty()
  concourId: string;

  @IsString()
  @IsNotEmpty()
  specialityId: string;
}
