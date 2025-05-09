import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { isNil, omitBy } from 'lodash';
import { GetUser } from '@/auth/decorator';
import { UseRoles } from 'nest-access-control';
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
    possession: 'any',
  })
  @Get()
  getAllUsers(
    @Query('page') page: number,
    @Query('roles') roles: string,
    @Query('keyword') keyword?: string,
    @Query('perPage') perPage = 10,
  ) {
    return this.userService.getAllUsers(page, keyword, roles as Role, perPage);
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
