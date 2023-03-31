/* eslint-disable prettier/prettier */
import { CreatePostDto } from 'src/posts/dto/create-post.dto';

export const PostDtoStub = (): CreatePostDto => {
  return {
    title: 'This is the title of the article',
    body: 'This is a stub for testing',
  };
};
