import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  Header,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseRoles } from 'nest-access-control';
import { ConcourService } from './concour.service';
import { diskStorage } from 'multer';
import { ConcourDto, UpdateConcourDto } from './dto';
import { Public } from '@/auth/decorator';

@Controller('concours')
export class ConcourController {
  constructor(private concourService: ConcourService) {}

  @UseRoles({
    resource: 'concours',
    action: 'create',
    possession: 'any',
  })
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/anounce',
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
          new MaxFileSizeValidator({ maxSize: 1000 * 1000 * 8 }),
          new FileTypeValidator({ fileType: 'pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() concour: ConcourDto,
  ) {
    return this.concourService.create(concour, file.filename);
  }

  @Public()
  @Get('/published')
  findAllPublished(@Query('page') page = 1, @Query('perPage') perPage = 10) {
    return this.concourService.findAllPublished(page, perPage);
  }

  @Public()
  @Get('/autocomplete')
  autocomplere(@Query('name') name: string) {
    return this.concourService.autocomplete(name, true);
  }

  @Public()
  @Get('/:id/specialities')
  getSpecialities(@Param('id') id: string) {
    return this.concourService.getSpecialities(id);
  }

  @UseRoles({
    resource: 'concours',
    action: 'read',
    possession: 'any',
  })
  @Get('/admin/autocomplete')
  adminAutocomplete(@Query('name') name: string) {
    return this.concourService.autocomplete(name, false);
  }

  @UseRoles({
    resource: 'concours',
    action: 'read',
    possession: 'any',
  })
  @Get()
  findAll(@Query('page') page = 1, @Query('perPage') perPage = 10) {
    return this.concourService.findAll(page, perPage);
  }

  @Public()
  @Get('/:id/anounce')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename=anounce.pdf')
  getFile(@Param('id') id: string) {
    return this.concourService.getFile(id);
  }

  @UseRoles({
    resource: 'concours',
    action: 'read',
    possession: 'any',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.concourService.findOne(id);
  }

  @UseRoles({
    resource: 'concours',
    action: 'update',
    possession: 'any',
  })
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/anounce',
        filename: (req, file, cb) => {
          const fileSplit = file.originalname.split('.');
          const fileExt = fileSplit[fileSplit.length - 1];
          cb(null, `${file.fieldname}_${Date.now()}.${fileExt}`);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() concour: UpdateConcourDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1000 * 8 }),
          new FileTypeValidator({ fileType: 'pdf' }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.concourService.update(id, concour, file?.filename);
  }

  @UseRoles({
    resource: 'concours',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.concourService.remove(id);
  }
}
