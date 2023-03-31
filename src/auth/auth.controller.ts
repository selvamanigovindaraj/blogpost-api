import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    /* TODO document why this method 'googleLogin' is empty */
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleLoginRedirect(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {
    /* TODO document why this method 'facebookLogin' is empty */
  }

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  facebookLoginRedirect(@Request() req) {
    return this.authService.login(req.user);
  }
}
