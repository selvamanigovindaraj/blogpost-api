import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

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
