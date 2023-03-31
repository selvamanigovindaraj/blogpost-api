import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PostsService } from './posts.service';
import { Connection, connect, Model } from 'mongoose';
import { Post, PostSchema } from './post.schema';
import { getModelToken } from '@nestjs/mongoose';
import { PostDtoStub } from '../../test/post.dto.stub';

describe('postService', () => {
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let postModel: Model<Post>;
  let postService: PostsService;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    postModel = mongoConnection.model(Post.name, PostSchema);
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getModelToken(Post.name), useValue: postModel },
      ],
    }).compile();
    postService = app.get<PostsService>(PostsService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('create', () => {
    it('should return the saved post', async () => {
      const createPost = await postService.createPost(PostDtoStub(), {
        userId: '1',
      });
      expect(createPost.title).toBe(PostDtoStub().title);
    });
  });

  describe('update', () => {
    it('should return the updated post', async () => {
      const createPost = await postService.createPost(PostDtoStub(), {
        userId: '1',
      });
      await postService.updatePostById(createPost._id, {
        title: 'new title',
      });
      const updatePost = await postService.findPostById(createPost._id);
      expect(updatePost.title).toBe('new title');
    });
  });

  describe('get Post By User', () => {
    it('should return the corresponding saved post', async () => {
      await postService.createPost(PostDtoStub(), { userId: '1' });
      await postService.createPost(PostDtoStub(), { userId: '1' });
      await postService.createPost(PostDtoStub(), { userId: '1' });
      const posts = await postService.findPostByUserId({ userId: '1' });
      expect(posts[0].title).toBe(PostDtoStub().title);
      expect(posts.length).toBe(3);
    });
  });

  describe('get Post By Id', () => {
    it('should return the corresponding saved post', async () => {
      const post = await postService.createPost(PostDtoStub(), { userId: '1' });
      const newPost = await postService.findPostById(post._id);
      expect(newPost.title).toBe(PostDtoStub().title);
    });
  });

  describe('delete Post By Id', () => {
    it('should delete the corresponding saved post', async () => {
      const post = await postService.createPost(PostDtoStub(), { userId: '1' });
      const deleteAck = await postService.deletePostById(post._id);
      expect(deleteAck.acknowledged).toBe(true);
      expect(deleteAck.deletedCount).toBe(1);
    });
    it('get Post By Id should return null for deleted Post', async () => {
      const post = await postService.createPost(PostDtoStub(), { userId: '1' });
      await postService.deletePostById(post._id);
      const deletedPost = await postService.findPostById(post._id);
      expect(deletedPost).toBeNull();
    });
  });
});
