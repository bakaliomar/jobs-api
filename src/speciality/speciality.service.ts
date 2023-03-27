import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SpecialityDto } from './dto';

@Injectable()
export class SpecialityService {
  constructor(private prisma: PrismaService) {}

  async createSpeciality(speciality: SpecialityDto) {
    try {
      const createdSpeciality = await this.prisma.speciality.create({
        data: {
          name: speciality.name,
        },
        select: {
          name: true,
          id: true,
        },
      });
      return createdSpeciality;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException(
            `this ${error.meta.target} alread exist`,
          );
      }
      throw error;
    }
  }
}
