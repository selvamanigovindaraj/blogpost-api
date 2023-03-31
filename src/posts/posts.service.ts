import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  create(createPostDto: CreatePostDto, user) {
    const createPost = { ...createPostDto, userId: user.userId };
    const post = new this.postModel(createPost);
    return post.save();
  }

  findAll(user) {
    return this.postModel.find({ userId: user.userId }).exec();
  }

  findOne(id: string) {
    return this.postModel.findById(id).exec();
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel.findOneAndUpdate({ _id: id }, updatePostDto).exec();
  }

  remove(id: string) {
    return this.postModel.deleteOne({ _id: id }).exec();
  }
}
