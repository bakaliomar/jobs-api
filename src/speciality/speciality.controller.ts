import { Public } from '@/auth/decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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
  create(@Body() speciality: SpecialityDto) {
    return this.specialityService.create(speciality);
  }

  @UseRoles({
    resource: 'specialities',
    action: 'read',
    possession: 'any',
  })
  @Get()
  findAll(@Query('page') page: number, @Query('perPage') perPage = 10) {
    return this.specialityService.findAll(page, perPage);
  }

  @Public()
  @Get('/autocomplete')
  autocomplere(@Query('name') name: string) {
    return this.specialityService.autocomplete(name);
  }

  @UseRoles({
    resource: 'specialities',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialityService.findOne(id);
  }

  @UseRoles({
    resource: 'specialities',
    action: 'update',
    possession: 'any',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() speciality: SpecialityDto) {
    return this.specialityService.update(id, speciality);
  }

  @UseRoles({
    resource: 'specialities',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specialityService.remove(id);
  }
}
