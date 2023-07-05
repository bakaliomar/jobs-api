import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Header,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseRoles } from 'nest-access-control';
import { diskStorage } from 'multer';
import { CandidatureDto } from './dto';
import { CandidatureService } from './candidature.service';
import { Public } from '@/auth/decorator';
import { CandidatureState } from '@prisma/client';

@Controller('candidatures')
export class CandidatureController {
  constructor(private candidatureService: CandidatureService) {}

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
          new MaxFileSizeValidator({ maxSize: 1000 * 1000 * 5 }),
          new FileTypeValidator({ fileType: 'pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() candidature: CandidatureDto,
  ) {
    return this.candidatureService.create(candidature, file.filename);
  }

  @UseRoles({
    resource: 'candidateurs',
    action: 'read',
    possession: 'any',
  })
  @Get()
  findAll(
    @Query('concour') concour: string,
    @Query('speciality') speciality: string,
    @Query('keyword') keyword: string,
    @Query('state') state: CandidatureState,
    @Query('archived') archived = 'false',
    @Query('page') page = 1,
    @Query('perPage') perPage = 20,
  ) {
    return this.candidatureService.findAll(
      concour,
      speciality,
      keyword,
      state,
      archived == 'true',
      page,
      perPage,
    );
  }

  @UseRoles({
    resource: 'candidateurs',
    action: 'read',
    possession: 'any',
  })
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.candidatureService.findOne(id);
  }

  @UseRoles({
    resource: 'candidateurs',
    action: 'read',
    possession: 'any',
  })
  @Get('/:id/dossier')
  getFile(@Param('id') id: string) {
    return this.candidatureService.getFile(id);
  }

  @UseRoles({
    resource: 'candidateurs',
    action: 'update',
    possession: 'any',
  })
  @Patch(':id/toggle')
  toggleState(
    @Param('id') id: string,
    @Body('state') state: CandidatureState,
    @Body('motive') motive?: string,
  ) {
    return this.candidatureService.toggleState(id, state, motive);
  }

  @UseRoles({
    resource: 'candidateurs',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidatureService.remove(id);
  }

  @UseRoles({
    resource: 'candidateurs',
    action: 'read',
    possession: 'any',
  })
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-Disposition', 'attachment; filename=file.xlsx')
  @Get('/excel/download')
  exportExcel(
    @Query('concour') concour?: string,
    @Query('speciality') speciality?: string,
    @Query('keyword') keyword?: string,
    @Query('state') state?: string,
    @Query('archived') archived = 'false',
  ) {
    return this.candidatureService.exportExcel(
      concour,
      speciality,
      keyword,
      state,
      archived == 'true',
    );
  }

  @UseRoles({
    resource: 'candidateurs',
    action: 'read',
    possession: 'any',
  })
  @Get('/csv/download')
  exportCsv(
    @Query('concour') concour?: string,
    @Query('speciality') speciality?: string,
    @Query('keyword') keyword?: string,
    @Query('state') state?: string,
    @Query('archived') archived = 'false',
  ) {
    return this.candidatureService.exportCsv(
      concour,
      speciality,
      keyword,
      state,
      archived == 'true',
    );
  }
}
