import { Body, Controller, Post } from '@nestjs/common';
import { UseRoles } from 'nest-access-control';
import { SpecialityDto } from './dto';
import { SpecialityService } from './speciality.service';

@Controller('specialities')
export class SpecialityController {
  constructor(private specialityService: SpecialityService) {}

  @UseRoles({
    resource: 'specialities',
    action: 'create',
    possession: 'any',
  })
  @Post()
  createSpeciality(@Body() speciality: SpecialityDto) {
    return this.specialityService.createSpeciality(speciality);
  }
}
