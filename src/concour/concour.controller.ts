import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseRoles } from 'nest-access-control';
import { ConcourService } from './concour.service';
import { diskStorage } from 'multer';
import { ConcourDto } from './dto';
import { Public } from '@/auth/decorator';
import { GetPaginate } from '@/prisma/decorator/get-paginate';
import { PaginateFunction } from 'prisma-pagination';

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
          cb(null, `${file.fieldname}_${Date.now()}.${fileExt}`);
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() concour: ConcourDto,
  ) {
    console.log(concour);
    return this.concourService.create(concour, file.filename);
  }

  @Public()
  @Get('/published')
  findAllPublished(@GetPaginate() paginate: PaginateFunction) {
    return this.concourService.findAllPublished(paginate);
  }

  @UseRoles({
    resource: 'concours',
    action: 'read',
    possession: 'any',
  })
  @Get()
  findAll(@GetPaginate() paginate: PaginateFunction) {
    return this.concourService.findAll(paginate);
  }
}
