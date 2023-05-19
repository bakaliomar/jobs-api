import { PrismaService } from '@/prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createPaginator } from 'prisma-pagination';
import { SpecialityDto } from './dto';
import { Speciality, Prisma } from '@prisma/client';

@Injectable()
export class SpecialityService {
  constructor(private prisma: PrismaService) {}

  async create(speciality: SpecialityDto) {
    try {
      const createdSpeciality = await this.prisma.speciality.create({
        data: {
          name: speciality.name,
          nameArabic: speciality.nameArabic,
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

  async findAll(page: number, perPage: number) {
    try {
      const paginate = createPaginator({ perPage });
      const specialities = await paginate<
        Speciality,
        Prisma.SpecialityFindManyArgs
      >(
        this.prisma.speciality,
        {
          select: {
            name: true,
            nameArabic: true,
            id: true,
          },
        },
        { page },
      );
      return specialities;
    } catch (error) {
      throw error;
    }
  }

  async autocomplete(name: string) {
    return await this.prisma.speciality.findMany({
      where: {
        ...(name ? { name } : {}),
      },
      select: {
        id: true,
        name: true,
      },
    });
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
          nameArabic: speciality.nameArabic,
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
