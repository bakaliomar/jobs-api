import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PaginateFunction } from 'prisma-pagination';
import { ConcourDto } from './dto';

@Injectable()
export class ConcourService {
  constructor(private prisma: PrismaService) {}

  async create(concour: ConcourDto, name: string) {
    try {
      const createdConcour = await this.prisma.concour.create({
        data: {
          name: concour.name,
          description: concour.description,
          location: concour.location || null,
          closingDate: new Date(concour.closingDate),
          concourDate: new Date(concour.concourDate),
          positionsNumber: +concour.positionsNumber,
          closed: !!concour.closed,
          anounce: name,
        },
        select: {
          id: true,
          name: true,
        },
      });
      concour.specialities.forEach(async (specilaity: string) => {
        await this.prisma.concourToSpeciality.create({
          data: {
            concourId: createdConcour.id,
            specialityId: specilaity,
          },
        });
      });

      return createdConcour;
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

  async findAllPublished(paginate: PaginateFunction) {
    const concours = await paginate(this.prisma.concour, {
      select: {
        name: true,
        description: true,
        closingDate: true,
        concourDate: true,
        positionsNumber: true,
        anounce: true,
        concourSpeciality: {
          select: {
            speciality: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
      where: {
        closed: true,
      },
    });

    return concours;
  }

  async findAll(paginate: PaginateFunction) {
    const concours = await paginate(this.prisma.concour, {
      select: {
        name: true,
        description: true,
        closingDate: true,
        concourDate: true,
        positionsNumber: true,
        anounce: true,
        concourSpeciality: {
          select: {
            speciality: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
      },
    });
    return concours;
  }
}
