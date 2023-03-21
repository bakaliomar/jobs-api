import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SigninAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // post /auth/signin
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SigninAuthDto) {
    return this.authService.signin(dto);
  }

  // post /auth/signip
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }
}
