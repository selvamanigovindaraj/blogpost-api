import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class CreatePostDto {
  @ApiProperty({
    required: true,
    minimum: 5,
  })
  title: string;

  @ApiProperty({
    required: true,
    minimum: 20,
  })
  body: string;
}
