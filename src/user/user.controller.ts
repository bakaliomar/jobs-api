import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { isNil, omitBy } from 'lodash';
import { GetUser } from '@/auth/decorator';
import { JwtGuard } from '@/auth/guard';
import { UseRoles } from 'nest-access-control';
import { GetPaginate } from '@/prisma/decorator/get-paginate';
import { PaginateFunction } from 'prisma-pagination';
import { UserService } from './user.service';
import { userDto } from './dto/user.dto';

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
  })
  @Get()
  getAllUsers(@GetPaginate() paginate: PaginateFunction) {
    return this.userService.getAllUsers(paginate);
  }

  @UseRoles({
    resource: 'users',
    action: 'update',
    possession: 'any',
  })
  @Post()
  createUser(@Body() user: userDto): Promise<{ id: string; email: string }> {
    return this.userService.createUser(user);
  }

  @UseRoles({
    resource: 'users',
    action: 'update',
    possession: 'any',
  })
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() user: Partial<userDto>) {
    this.userService.updateUser(id, user);
  }

  @UseRoles({
    resource: 'users',
    action: 'delete',
    possession: 'any',
  })
  @Delete(':id')
  destroy(@Param('id') id: string) {
    this.userService.deleteUser(id);
  }
}
