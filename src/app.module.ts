import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JobModule } from './job/job.module';
import { CandidatureModule } from './candidature/candidature.module';
import { SpecialityModule } from './speciality/speciality.module';
import { ConcourModule } from './concour/concour.module';
import { PrismaModule } from './prisma/prisma.module';
import { AccessControlModule } from 'nest-access-control';
import { RBAC_POLICY } from './auth/rbac-policy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccessControlModule.forRoles(RBAC_POLICY),
    AuthModule,
    UserModule,
    JobModule,
    CandidatureModule,
    SpecialityModule,
    ConcourModule,
    PrismaModule,
  ],
})
export class AppModule {}
