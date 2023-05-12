import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { GetUser, Public } from './decorator';
import { AuthDto, SigninAuthDto } from './dto';
import { RtGuard } from './guard';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // post /auth/signin
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @Public()
  signin(@Body() dto: SigninAuthDto): Promise<Tokens> {
    return this.authService.signin(dto);
  }

  // post /auth/signip
  @Post('signup')
  @Public()
  signup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  // POST /auth/logout
  @Delete('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  // Post /auth/refresh
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@GetUser() user: User & { refreshToken: string }) {
    return this.authService.refresh(user.id, user.refreshToken);
  }
}
