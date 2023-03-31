import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ConcourDto } from './dto';

@Injectable()
export class ConcourService {
  constructor(private prisma: PrismaService) {}

  async create(concour: ConcourDto) {
    try {
      const createdConcour = await this.prisma.concour.create({
        data: {
          name: concour.name,
          description: concour.description,
          location: concour.location || null,
          closingDate: new Date(concour.closingDate) || null,
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
}
