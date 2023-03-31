import { GetPaginate } from '@/prisma/decorator/get-paginate';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UseRoles } from 'nest-access-control';
import { PaginateFunction } from 'prisma-pagination';
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
  findAll(@GetPaginate() paginate: PaginateFunction) {
    return this.specialityService.findAll(paginate);
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
