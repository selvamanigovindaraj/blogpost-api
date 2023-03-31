/* eslint-disable prettier/prettier */

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

/**
 * Passport strategy for authenticating with Google using OAuth2.
 * @class
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:3000/login/google/redirect',
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  /**
   * Validate the user's Google account information and return the user's data.
   * @param {any} request - The request object.
   * @param {string} accessToken - The access token.
   * @param {string} refreshToken - The refresh token.
   * @param {any} profile - The user's Google profile information.
   * @param {VerifyCallback} done - Callback function to return the user or error.
   * @returns {Promise<any>} The user's data or error.
   * @throws {UnauthorizedException} Throws an exception if user profile is not available.
   */
  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    if (!profile) {
      throw new UnauthorizedException();
    }
    const { name, emails, photos, provider, id } = profile;

    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      provider,
      id
    };
    await this.authService.findOrCreate(user);
    done(null, user);
  }
}
