import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';

/**
 * Injectable service responsible for handling Post related operations
 *
 * @class PostsService
 */
@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  /**
   * Creates a new Post and saves it to the database
   *
   * @param {CreatePostDto} createPostDto - Data for the new post to be created
   * @param {object} user - User object
   * @returns {Promise<Post>} Promise that resolves to the created Post object
   */
  createPost(createPostDto: CreatePostDto, { userId }): Promise<Post> {
    const createPost = { ...createPostDto, userId };
    const post = new this.postModel(createPost);
    return post.save();
  }

  /**
   * Finds all Posts created by a particular user
   *
   * @param {object} user - User object
   * @returns {Promise<Post[]>} Promise that resolves to an array of Post objects
   */
  findPostByUserId({ userId }): Promise<Post[]> {
    return this.postModel.find({ userId }).exec();
  }

  /**
   * Finds a Post by its unique identifier
   *
   * @param {ObjectId} id - Unique identifier for the Post
   * @returns {Promise<Post>} Promise that resolves to the Post object
   */
  findPostById(id: ObjectId): Promise<Post> {
    return this.postModel.findById(id).exec();
  }

  /**
   * Updates a Post with the provided data
   *
   * @param {ObjectId} id - Unique identifier for the Post
   * @param {UpdatePostDto} updatePostDto - Data to update the Post with
   * @returns {Promise<Post>} Promise that resolves to the updated Post object
   */
  updatePostById(id: ObjectId, updatePostDto: UpdatePostDto): Promise<Post> {
    return this.postModel.findOneAndUpdate({ _id: id }, updatePostDto).exec();
  }

  /**
   * Deletes a Post by its unique identifier
   *
   * @param {ObjectId} id - Unique identifier for the Post
   * @returns {Promise<any>} Promise that resolves to the delete result object
   */
  deletePostById(id: ObjectId): Promise<any> {
    return this.postModel.deleteOne({ _id: id }).exec();
  }
}
