/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

/**
 * User mongoose schema definition
 */
@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    required: true,
    index: true
  })
  userId: string;

  @Prop()
  provider: string;
}

/**
 * Mongoose schema for User class
 */
export const UserSchema = SchemaFactory.createForClass(User);
