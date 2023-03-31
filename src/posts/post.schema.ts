/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type PostDocument = HydratedDocument<Post>;

@Schema({timestamps: true})
export class Post {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({
    required:true,
    index: true
  })
  userId: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);