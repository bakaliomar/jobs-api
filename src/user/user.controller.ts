import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { isNil, omitBy } from 'lodash';
import { GetUser } from '@/auth/decorator';
import { UseRoles } from 'nest-access-control';
import { GetPaginate } from '@/prisma/decorator/get-paginate';
import { PaginateFunction } from 'prisma-pagination';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  //GET /users/me
  @Get('me')
  getMe(@GetUser() user: User) {
    return omitBy(user, isNil);
  }

  @UseRoles({
    resource: 'users',
    action: 'read',
    possession: 'any',
  })
  @Get('all')
  getAllUsers(@GetPaginate() paginate: PaginateFunction) {
    return this.userService.getAllUsers(paginate);
  }
}
