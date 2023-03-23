import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { GetUser, Public } from './decorator';
import { AuthDto, SigninAuthDto } from './dto';
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
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  // Post /auth/refresh
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@GetUser() user: User & { refresh_token: string }) {
    return this.authService.refresh(user.id, user.refresh_token);
  }
}
