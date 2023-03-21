import { Module } from '@nestjs/common';
import { CandidatureController } from './candidature.controller';
import { CandidatureService } from './candidature.service';

@Module({
  controllers: [CandidatureController],
  providers: [CandidatureService],
})
export class CandidatureModule {}
