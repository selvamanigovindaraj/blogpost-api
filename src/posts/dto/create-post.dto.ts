/**
 * Data transfer object for creating a post.
 * @export
 * @class CreatePostDto
 */
import { ApiProperty } from '@nestjs/swagger';
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
  title: string;
  /**
   * Body of the post.
   * @type {string}
   * @memberof CreatePostDto
   */
  @ApiProperty({
    required: true,
    minimum: 20,
  })
  body: string;
}
