import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PaginateFunction } from 'prisma-pagination';

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
}
