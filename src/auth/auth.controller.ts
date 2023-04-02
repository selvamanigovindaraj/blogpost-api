/**
 * NestJS controller for authentication using Google and Facebook.
 */
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('login')
export class AuthController {
  /**
   * Creates an instance of AuthController.
   * @param {AuthService} authService - Service for authentication.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint for initiating a Google login request.
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    /* TODO document why this method 'googleLogin' is empty */
  }

  /**
   * Endpoint for handling the Google login redirect.
   * @param {Object} req - HTTP request object.
   * @returns {Promise<any>} - Promise representing the authenticated user.
   */
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleLoginRedirect(@Request() req) {
    return this.authService.login(req.user);
  }

  /**
   * Endpoint for initiating a Facebook login request.
   */
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {
    /* TODO document why this method 'facebookLogin' is empty */
  }

  /**
   * Endpoint for handling the Facebook login redirect.
   * @param {Object} req - HTTP request object.
   * @returns {Promise<any>} - Promise representing the authenticated user.
   */
  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  facebookLoginRedirect(@Request() req) {
    return this.authService.login(req.user);
  }
}
