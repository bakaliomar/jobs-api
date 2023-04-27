import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseRoles } from 'nest-access-control';
import { CandidatureService } from './candidature.service';
import { diskStorage } from 'multer';
import { CandidatureDto } from './dto';
import { Public } from '@/auth/decorator';
import { GetPaginate } from '@/prisma/decorator/get-paginate';
import { PaginateFunction } from 'prisma-pagination';

@Controller('candidatures')
export class CandidatureController {
  constructor(private CandidatureService: CandidatureService) {}

  @Public()
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/candidatures',
        filename: (req, file, cb) => {
          const fileSplit = file.originalname.split('.');
          const fileExt = fileSplit[fileSplit.length - 1];
          cb(null, `${fileSplit[0]}_${Date.now()}.${fileExt}`);
        },
      }),
    }),
  )
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 5 }),
          new FileTypeValidator({ fileType: 'pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() candidature: CandidatureDto,
  ) {
    return this.CandidatureService.create(candidature, file.filename);
  }

  @UseRoles({
    resource: 'candidateurs',
    action: 'read',
    possession: 'any',
  })
  @Get()
  findAll(
    @GetPaginate() paginate: PaginateFunction,
    @Query('concour') concour: string,
    @Query('speciality') speciality: string,
    @Query('keyword') keyword: string,
  ) {
    return this.CandidatureService.findAll(
      paginate,
      concour,
      speciality,
      keyword,
    );
  }
}
