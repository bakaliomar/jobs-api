import { PrismaService } from '@/prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PaginateFunction } from 'prisma-pagination';
import { SpecialityDto } from './dto';

@Injectable()
export class SpecialityService {
  constructor(private prisma: PrismaService) {}

  async create(speciality: SpecialityDto) {
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

  async findAll(paginate: PaginateFunction) {
    try {
      const specialities = await paginate(this.prisma.speciality, {
        select: {
          name: true,
          id: true,
        },
      });
      return specialities;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    const speciality = await this.prisma.speciality.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
      },
    });
    if (!speciality)
      throw new NotFoundException("this speciality desn't exist");
    return speciality;
  }

  async update(id: string, speciality: SpecialityDto) {
    try {
      await this.prisma.speciality.update({
        where: {
          id,
        },
        data: {
          name: speciality.name,
        },
      });
      return { success: true };
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

  async remove(id: string) {
    try {
      await this.prisma.speciality.delete({
        where: {
          id,
        },
      });
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}
