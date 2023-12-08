import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto, SigninAuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './types';

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
        OR: [{ email: dto.userName }, { userName: dto.userName }],
      },
    });
    //if user doesn't exist throw exception
    if (!user) throw new ForbiddenException('credentials is incorrect');
    //compare the password
    const pwMatches = await argon.verify(user.password, dto.password);
    //if password is incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('credentials is incorrect');

    const tokens = await this.signToken(user.id, user.email);
    await this.updateHasehdRt(user.id, tokens.refresh_token);

    // return the user
    return tokens;
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
          firstName: dto.firstName,
          lastName: dto.lastName,
          cin: dto.cin,
        },
      });
      const tokens = await this.signToken(user.id, user.email);
      await this.updateHasehdRt(user.id, tokens.refresh_token);
      // return the saved user token
      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
    return true;
  }

  async refresh(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException('Access Denied');
    const rtMatched = await argon.verify(user.hashedRt, rt);
    if (!rtMatched) throw new ForbiddenException('Access Denied');

    const tokens = await this.signToken(user.id, user.email);
    await this.updateHasehdRt(user.id, tokens.refresh_token);
    // return the saved user token
    return tokens;
  }

  async updateHasehdRt(userId: string, rt: string) {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async signToken(userId: string, email: string): Promise<Tokens> {
    const payload = {
      sub: userId,
      email,
    };

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: 60 * 15,
        secret: this.config.get('AT_SECRET'),
      }),
      this.jwt.signAsync(payload, {
        expiresIn: 60 * 60 * 24 * 7,
        secret: this.config.get('RT_SECRET'),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
