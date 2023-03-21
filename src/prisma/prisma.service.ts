import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDB() {
    this.$transaction([
      this.candidature.deleteMany(),
      this.job.deleteMany(),
      this.user.deleteMany(),
      this.concour.deleteMany(),
      this.speciality.deleteMany(),
    ]);
  }
}
