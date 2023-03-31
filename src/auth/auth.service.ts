import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
/**
 * A service that provides authentication functionality.
 */
@Injectable()
export class AuthService {
  /**
   * Creates an instance of the `AuthService`.
   *
   * @param userModel - The Mongoose `UserModel` used to interact with the database.
   * @param jwtService - The `JwtService` used to generate JWT tokens.
   */
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  /**
   * Finds an existing user with the given profile or creates a new user if one does not exist.
   *
   * @param profile - The user's profile information.
   * @returns A `Promise` that resolves to the created or found user.
   */
  async findOrCreate(profile): Promise<User> {
    console.log({ profile });
    const user = await this.userModel.findOne({ userId: profile.id }).exec();
    if (user) {
      return user;
    }
    const createdUser = new this.userModel({
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      userId: profile.id,
      provider: profile.provider,
    });
    return createdUser.save();
  }

  /**
   * Generates a JWT token for the given user.
   *
   * @param user - The user to generate a token for.
   * @returns An object containing an access token generated using the `JwtService`.
   */
  login(user) {
    const payload = {
      email: user.email,
      sub: user.id,
      provider: user.provider,
    };
    console.log({ payload });
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
