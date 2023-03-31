/* eslint-disable prettier/prettier */
/**
 * Passport strategy for Facebook authentication.
 *
 * @class
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  /**
   * Creates an instance of FacebookStrategy.
   *
   * @constructor
   * @param {AuthService} authService - The authentication service.
   */
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:3000/login/facebook/redirect',
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  /**
   * Validates a Facebook user's credentials.
   *
   * @async
   * @param {string} accessToken - The Facebook user's access token.
   * @param {string} refreshToken - The Facebook user's refresh token.
   * @param {Profile} profile - The Facebook user's profile data.
   * @param {Function} done - The Passport callback function.
   * @returns {Promise<any>} - A Promise that resolves to the authenticated user.
   * @throws {UnauthorizedException} - If the user is not authorized.
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    if (!profile) {
      throw new UnauthorizedException();
    }
    const { name, emails, id, provider } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      id,
      provider,
      accessToken,
    };
    await this.authService.findOrCreate(user);
    done(null, user);
  }
}
