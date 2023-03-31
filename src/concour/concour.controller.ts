import { Body, Controller, Post } from '@nestjs/common';
import { UseRoles } from 'nest-access-control';
import { ConcourService } from './concour.service';
import { ConcourDto } from './dto';

@Controller('concours')
export class ConcourController {
  constructor(private concourService: ConcourService) {}

  @UseRoles({
    resource: 'concours',
    action: 'create',
    possession: 'any',
  })
  @Post()
  create(@Body() concour: ConcourDto) {
    return this.concourService.create(concour);
  }
}
