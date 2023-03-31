/**
 * NestJS controller for managing posts.
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { ObjectId } from 'mongoose';

@Controller('posts')
export class PostsController {
  /**
   * Creates an instance of PostsController.
   * @param {PostsService} postsService - Service for managing posts.
   */
  constructor(private readonly postsService: PostsService) {}

  /**
   * Endpoint for creating a new post.
   * @param {Object} req - HTTP request object.
   * @param {CreatePostDto} createPostDto - DTO for creating a new post.
   * @returns {Promise<any>} - Promise representing the new post.
   */
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto, req.user);
  }

  /**
   * Endpoint for retrieving all posts.
   * @param {Object} req - HTTP request object.
   * @returns {Promise<any>} - Promise representing all posts.
   */
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllPostForUser(@Request() req) {
    return this.postsService.findPostByUserId(req.user);
  }

  /**
   * Endpoint for retrieving a single post by ID.
   * @param {string} id - ID of the post to retrieve.
   * @returns {Promise<any>} - Promise representing the post.
   */
  @Get(':id')
  getPostById(@Param('id') id: ObjectId) {
    return this.postsService.findPostById(id);
  }

  /**
   * Endpoint for updating a post by ID.
   * @param {string} id - ID of the post to update.
   * @param {UpdatePostDto} updatePostDto - DTO for updating the post.
   * @returns {Promise<any>} - Promise representing the updated post.
   */
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updatePost(@Param('id') id: ObjectId, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePostById(id, updatePostDto);
  }

  /**
   * Endpoint for deleting a post by ID.
   * @param {string} id - ID of the post to delete.
   * @returns {Promise<any>} - Promise representing the deleted post.
   */
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deletePost(@Param('id') id: ObjectId) {
    return this.postsService.deletePostById(id);
  }
}
