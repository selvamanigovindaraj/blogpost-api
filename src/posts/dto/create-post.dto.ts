/**
 * Data transfer object for creating a post.
 * @export
 * @class CreatePostDto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  /**
   * Title of the post.
   * @type {string}
   * @memberof CreatePostDto
   */
  @ApiProperty({
    required: true,
    minimum: 5,
  })
  @IsNotEmpty()
  @IsString()
  title: string;
  /**
   * Body of the post.
   * @type {string}
   * @memberof CreatePostDto
   */
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    minimum: 20,
  })
  body: string;
}
