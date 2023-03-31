/* eslint-disable prettier/prettier */
/**
 * The JwtStrategy class provides a Passport.js strategy for validating JWT tokens.
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Initializes a new instance of the JwtStrategy class.
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * Validates a user's payload.
   *
   * @param payload - The payload to validate.
   * @returns The validated payload.
   */
  async validate(payload: any) {
    return { userId: payload.sub };
  }
}
