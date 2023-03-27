import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CandidatureModule } from './candidature/candidature.module';
import { SpecialityModule } from './speciality/speciality.module';
import { PrismaModule } from './prisma/prisma.module';
import { AccessControlModule, ACGuard } from 'nest-access-control';
import { RBAC_POLICY } from './auth/rbac-policy';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guard';
import { ConcourModule } from '@/concour/concour.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccessControlModule.forRoles(RBAC_POLICY),
    AuthModule,
    UserModule,
    CandidatureModule,
    SpecialityModule,
    ConcourModule,
    PrismaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ACGuard,
    },
  ],
})
export class AppModule {}
