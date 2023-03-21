import { JwtGuard } from '@/auth/guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ACGuard } from 'nest-access-control';

@UseGuards(JwtGuard, ACGuard)
@Controller('speciality')
export class SpecialityController {}
