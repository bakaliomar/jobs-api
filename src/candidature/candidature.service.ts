import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable, StreamableFile } from '@nestjs/common';
import { CandidatureState } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createReadStream } from 'fs';
import { join } from 'path';
import { PaginateFunction } from 'prisma-pagination';
import { CandidatureDto } from './dto';

@Injectable()
export class CandidatureService {
  constructor(private prisma: PrismaService) {}

  async create(candidature: CandidatureDto, name: string) {
    try {
      // check if user exist
      let user = await this.getUser(candidature.cin);
      if (!user) {
        //create user if not exist
        user = await this.createUser(candidature);
      }
      //create candidature
      const createdCandidature = await this.prisma.candidature.create({
        data: {
          currentJob: candidature.currentJob,
          graduationYear: +candidature.graduationYear,
          graduationCountry: candidature.graduationCountry,
          degreeLevel: candidature.degreeLevel,
          degreeSpeciality: candidature.degreeSpeciality,
          degreeTitle: candidature.degreeTitle,
          userId: user.id,
          specialityId: candidature.specialityId,
          concourId: candidature.concourId,
          isArchived: false,
          establishment: candidature.establishment,
          establishmentName: candidature.establishmentName,
          dossierLink: name,
          state: 'UNTREATED',
        },
        select: {
          id: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              title: true,
              cin: true,
            },
          },
          speciality: {
            select: {
              id: true,
              name: true,
            },
          },
          concour: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return createdCandidature;
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

  async findAll(
    paginate: PaginateFunction,
    concour: string,
    speciality: string,
    keyword: string,
    state: string,
    archived: boolean,
  ) {
    const candiadatures = await paginate(this.prisma.candidature, {
      where: {
        ...(concour ? { concourId: concour } : {}),
        ...(speciality ? { specialityId: speciality } : {}),
        ...(state ? { state } : {}),
        ...(archived ? { isArchived: archived } : {}),
        ...(keyword
          ? {
              user: {
                OR: [
                  { firstName: { contains: keyword } },
                  { lastName: { contains: keyword } },
                  { cin: { contains: keyword } },
                ],
              },
            }
          : {}),
      },
      select: {
        id: true,
        createdAt: true,
        establishment: true,
        isArchived: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            title: true,
            cin: true,
          },
        },
        speciality: {
          select: {
            id: true,
            name: true,
          },
        },
        concour: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return candiadatures;
  }

  async findOne(id: string) {
    return this.prisma.candidature.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        currentJob: true,
        graduationYear: true,
        graduationCountry: true,
        establishment: true,
        establishmentName: true,
        degreeLevel: true,
        degreeSpeciality: true,
        degreeTitle: true,
        state: true,
        motive: true,
        concour: {
          select: {
            id: true,
            name: true,
          },
        },
        speciality: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            cin: true,
            title: true,
            firstName: true,
            lastName: true,
            firstNameArabic: true,
            lastNameArabic: true,
            birthDate: true,
            birthPlace: true,
            birthPlaceArabic: true,
            email: true,
            phone: true,
            address: true,
            addressArabic: true,
            city: true,
            cityArabic: true,
            codePostal: true,
          },
        },
      },
    });
  }

  async getFile(id: string): Promise<StreamableFile> {
    const candidature = await this.prisma.candidature.findUnique({
      where: {
        id,
      },
      select: {
        dossierLink: true,
      },
    });
    const file = createReadStream(
      join(process.cwd(), 'files', 'candidatures', candidature.dossierLink),
    );
    return new StreamableFile(file);
  }

  async toggleState(id: string, state: CandidatureState) {
    try {
      const candidature = await this.prisma.candidature.update({
        where: {
          id,
        },
        data: {
          state: state,
        },
        select: {
          state: true,
        },
      });

      return candidature;
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

  async createUser(candidature: CandidatureDto) {
    return await this.prisma.user.create({
      data: {
        title: candidature.title,
        cin: candidature.cin,
        firstName: candidature.firstName,
        lastName: candidature.lastName,
        firstNameArabic: candidature.firstNameArabic,
        lastNameArabic: candidature.lastNameArabic,
        email: candidature.email,
        birthDate: new Date(candidature.birthDate),
        birthPlace: candidature.birthPlace,
        birthPlaceArabic: candidature.birthPlaceArabic,
        city: candidature.city,
        cityArabic: candidature.cityArabic,
        codePostal: candidature.codePostal,
        phone: candidature.phone,
        address: candidature.address,
        addressArabic: candidature.addressArabic,
      },
      select: {
        id: true,
      },
    });
  }

  async getUser(cin: string) {
    return await this.prisma.user.findUnique({
      where: {
        cin,
      },
      select: {
        id: true,
      },
    });
  }
}
