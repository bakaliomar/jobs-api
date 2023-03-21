import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto, SigninAuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signin(dto: SigninAuthDto) {
    //find the user by email or cin
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.user_name }, { cin: dto.user_name }],
      },
    });
    //if user doesn't exist throw exception
    if (!user) throw new ForbiddenException('credentials is oncorrect');
    //compare the password
    const pwMatches = argon.verify(user.password, dto.password);
    //if password is incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('credentials is oncorrect');

    // return the user
    return this.signToken(user.id, user.email);
  }

  async signup(dto: AuthDto) {
    try {
      // generate the password hash
      const hash = await argon.hash(dto.password);
      // save the user in database
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          firstName: dto.first_name,
          lastName: dto.last_name,
          cin: dto.cin,
        },
      });
      // return the saved user token
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60d',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
