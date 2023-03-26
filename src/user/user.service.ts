import { PrismaService } from '@/prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PaginateFunction } from 'prisma-pagination';
import { userDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(paginate: PaginateFunction) {
    const users = await paginate(this.prisma.user, {
      select: {
        email: true,
        firstName: true,
        lastName: true,
        cin: true,
        roles: true,
      },
    });
    return users;
  }

  async createUser(user: userDto) {
    try {
      const hash = await argon.hash(user.password);
      const createdUser = await this.prisma.user.create({
        data: {
          email: user.email,
          firstName: user.lastName,
          lastName: user.lastName,
          password: hash,
          cin: user.cin,
          roles: user.roles,
        },
        select: {
          id: true,
          email: true,
        },
      });
      return createdUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ForbiddenException(
            `this ${(error.meta.target as string[]).join(',')} already taken`,
          );
        }
      }
      throw error;
    }
  }

  async updateUser(id: string, user: Partial<userDto>) {
    try {
      if (user.password) {
        const hash = await argon.hash(user.password);
        user = { ...user, password: hash };
      }
      await this.prisma.user.updateMany({
        where: {
          id,
        },
        data: {
          ...user,
        },
      });
      return { success: true };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ForbiddenException(
            `this ${(error.meta.target as string[]).join(',')} already taken`,
          );
        }
      }
      throw error;
    }
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException("this user doesn't exist");
    return { success: true };
  }
}
