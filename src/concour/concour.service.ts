import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable, StreamableFile } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createReadStream, rm } from 'fs';
import { join } from 'path';
import { createPaginator } from 'prisma-pagination';
import { ConcourDto, UpdateConcourDto } from './dto';
import { omitBy, isUndefined } from 'lodash';
import { Concour, Prisma } from '@prisma/client';

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
          closed: concour.closed == true,
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

  async findAllPublished(page: number, perPage: number) {
    const paginate = createPaginator({ perPage });
    const concours = await paginate<Concour, Prisma.ConcourFindManyArgs>(
      this.prisma.concour,
      {
        select: {
          id: true,
          name: true,
          description: true,
          closingDate: true,
          concourDate: true,
          positionsNumber: true,
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
          closed: false,
        },
      },
      { page },
    );

    return concours;
  }

  async autocomplete(name: string, closed: boolean) {
    return await this.prisma.concour.findMany({
      where: {
        ...(name ? { name } : {}),
        ...(closed ? { closed: !closed } : {}),
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getSpecialities(id: string) {
    return await this.prisma.speciality.findMany({
      where: {
        concourSpeciality: {
          some: {
            concourId: id,
          },
        },
      },
      select: {
        name: true,
        id: true,
      },
    });
  }

  async findAll(page, perPage) {
    const paginate = createPaginator({ perPage });
    const concours = await paginate<Concour, Prisma.ConcourFindManyArgs>(
      this.prisma.concour,
      {
        select: {
          id: true,
          name: true,
          description: true,
          closingDate: true,
          concourDate: true,
          positionsNumber: true,
          anounce: true,
          closed: true,
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
      },
      { page },
    );
    return concours;
  }

  async getFile(id: string): Promise<StreamableFile> {
    const concour = await this.prisma.concour.findUnique({
      where: {
        id,
      },
      select: {
        anounce: true,
      },
    });
    const file = createReadStream(
      join(process.cwd(), 'files', 'anounce', concour.anounce),
    );
    return new StreamableFile(file);
  }

  async findOne(id: string) {
    const concour = await this.prisma.concour.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        closingDate: true,
        concourDate: true,
        positionsNumber: true,
        anounce: true,
        closed: true,
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

    return concour;
  }

  async update(id: string, concour: UpdateConcourDto, name: string) {
    try {
      const data = {
        name: concour.name,
        description: concour.description,
        location: concour.location || undefined,
        closingDate: concour.closingDate
          ? new Date(concour.closingDate)
          : undefined,
        concourDate: concour.concourDate
          ? new Date(concour.concourDate)
          : undefined,
        positionsNumber: +concour.positionsNumber,
        closed: concour.closed == 'true',
        anounce: name ? name : undefined,
      };

      // remove file was sent in the request
      if (!!name) {
        const { anounce } = await this.prisma.concour.findUnique({
          where: {
            id,
          },
          select: {
            anounce: true,
          },
        });
        rm(
          join(process.cwd(), 'files', 'anounce', anounce),
          { recursive: true },
          (err) => {
            console.log(err);
          },
        );
      }

      const updatedConcour = await this.prisma.concour.update({
        where: {
          id,
        },
        data: {
          ...omitBy(data, isUndefined),
        },
        select: {
          id: true,
          name: true,
        },
      });

      // delete all specialities
      await this.prisma.concourToSpeciality.deleteMany({
        where: {
          concourId: id,
        },
      });

      concour.specialities.forEach(async (specilaity: string) => {
        await this.prisma.concourToSpeciality.create({
          data: {
            concourId: id,
            specialityId: specilaity,
          },
        });
      });

      return updatedConcour;
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
      const { anounce } = await this.prisma.concour.findUnique({
        where: {
          id,
        },
        select: {
          anounce: true,
        },
      });
      rm(
        join(process.cwd(), 'files', 'anounce', anounce),
        { recursive: true },
        (err) => {
          console.log(err);
        },
      );
      await this.prisma.concour.delete({
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
