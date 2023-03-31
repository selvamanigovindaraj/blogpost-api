/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

/**
 * Represents a Post document in the database.
 * It is defined by a title, a body, a userId and a unique ObjectId.
 */
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

export type PostDocument = HydratedDocument<Post>;
export const PostSchema = SchemaFactory.createForClass(Post);