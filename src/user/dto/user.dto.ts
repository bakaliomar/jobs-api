import { AuthDto } from '@/auth/dto';
import { Role } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class userDto extends AuthDto {
  @IsEnum({ USER: 'USER', MANAGER: 'MANAGER', ADMIN: 'ADMIN' })
  @IsNotEmpty()
  roles: Role;
}
