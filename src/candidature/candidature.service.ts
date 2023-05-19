import { PrismaService } from '@/prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  StreamableFile,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CandidatureState } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createReadStream, rm } from 'fs';
import { join } from 'path';
import { createPaginator } from 'prisma-pagination';
import { CandidatureDto } from './dto';
import { Response } from 'express';
import { Candidature, Prisma } from '@prisma/client';

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
    concour: string,
    speciality: string,
    keyword: string,
    state: CandidatureState,
    archived: boolean,
    page: number,
    perPage: number,
  ) {
    const paginate = createPaginator({ perPage });
    const candiadatures = await paginate<
      Candidature,
      Prisma.CandidatureFindManyArgs
    >(
      this.prisma.candidature,
      {
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
          state: true,
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
      },
      { page },
    );

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

  async toggleState(id: string, state: CandidatureState, motive?: string) {
    try {
      const candidature = await this.prisma.candidature.update({
        where: {
          id,
        },
        data: {
          state,
          motive,
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

  async remove(id: string) {
    try {
      const { dossierLink } = await this.prisma.candidature.findUnique({
        where: {
          id,
        },
        select: {
          dossierLink: true,
        },
      });
      rm(
        join(process.cwd(), 'files', 'anounce', dossierLink),
        { recursive: true },
        (err) => {
          console.log(err);
        },
      );
      await this.prisma.candidature.delete({
        where: {
          id,
        },
      });
      return { success: true };
    } catch (err) {
      throw new BadRequestException('error while deleting');
    }
  }

  async exportExcel(
    res: Response,
    concour?: string,
    speciality?: string,
    keyword?: string,
    state?: string,
    archived?: boolean,
  ) {
    try {
      const candidatures = await this.getCandidatures(
        concour,
        speciality,
        keyword,
        state,
        archived,
      );

      if (!candidatures) {
        throw new NotFoundException('No Data to Download');
      }

      const columns = [
        'id',
        'date',
        'etablisment',
        'archived',
        'satatus',
        'prenom',
        'nom',
        'email',
        'titre',
        'cin',
        'specialite',
        'concour',
      ];

      //this statement tells the browser what type of data is supposed to download and force it to download
      res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=data.csv',
      });
      // whereas this part is in charge of telling what data should be parsed and be downloaded
      console.log(this.dataToCSV(candidatures, columns));
      res.end(this.dataToCSV(candidatures, columns), 'binary');

      console.log('Finished writing data');
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async getCandidatures(
    concour?: string,
    speciality?: string,
    keyword?: string,
    state?: string,
    archived?: boolean,
  ) {
    const candiadatures = await this.prisma.candidature.findMany({
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
        // eslint-disable-next-line @typescript-eslint/ban-types
      } as Object,
      select: {
        id: true,
        createdAt: true,
        establishment: true,
        isArchived: true,
        state: true,
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

  dataToCSV(dataList, headers) {
    const allObjects = [];
    // Pushing the headers, as the first arr in the 2-dimensional array 'allObjects' would be the first row
    allObjects.push(headers);

    //Now iterating through the list and build up an array that contains the data of every object in the list, in the same order of the headers
    dataList.forEach(function (object) {
      const arr = [];
      arr.push(object.id);
      arr.push((object.createdAt as Date).toISOString());
      arr.push(object.establishment);
      arr.push(object.isArchived);
      arr.push(object.state);
      arr.push(object.user.firstName);
      arr.push(object.user.lastName);
      arr.push(object.user.email);
      arr.push(object.user.title);
      arr.push(object.user.cin);
      arr.push(object.speciality.name);
      arr.push(object.concour.name);

      // Adding the array as additional element to the 2-dimensional array. It will evantually be converted to a single row
      allObjects.push(arr);
    });

    // Initializing the output in a new variable 'csvContent'
    let csvContent = '';

    // The code below takes two-dimensional array and converts it to be strctured as CSV
    // *** It can be taken apart from the function, if all you need is to convert an array to CSV
    allObjects.forEach(function (infoArray, index) {
      const dataString = infoArray.join(',');
      csvContent += index < allObjects.length ? dataString + '\n' : dataString;
    });

    // Returning the CSV output
    return csvContent;
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
