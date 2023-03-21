import { Module } from '@nestjs/common';
import { ConcourController } from './concour.controller';
import { ConcourService } from './concour.service';

@Module({
  controllers: [ConcourController],
  providers: [ConcourService],
})
export class ConcourModule {}
