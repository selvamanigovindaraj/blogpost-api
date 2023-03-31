import { ApiProperty } from '@nestjs/swagger';

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
  description: string;
}
