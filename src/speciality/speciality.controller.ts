import { AtGuard } from '@/auth/guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ACGuard } from 'nest-access-control';

@UseGuards(AtGuard, ACGuard)
@Controller('speciality')
export class SpecialityController {}
