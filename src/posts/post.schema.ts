/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
export type PostDocument = HydratedDocument<Post>;

@Schema({timestamps: true})
export class Post {
  @Prop()
  title: string;

  @Prop()
  body: string;

  @Prop({
    required:true,
    index: true
  })
  userId: string;

  _id: ObjectId
}

export const PostSchema = SchemaFactory.createForClass(Post);