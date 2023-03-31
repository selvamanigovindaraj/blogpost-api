import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Connection, connect, Model } from 'mongoose';
import { Post, PostSchema } from './post.schema';
import { getModelToken } from '@nestjs/mongoose';
import { PostDtoStub } from '../../test/post.dto.stub';

describe('PostsController', () => {
  let postsController: PostsController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let postModel: Model<Post>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    postModel = mongoConnection.model(Post.name, PostSchema);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        PostsService,
        { provide: getModelToken(Post.name), useValue: postModel },
      ],
    }).compile();
    postsController = app.get<PostsController>(PostsController);
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
      const createPost = await postsController.createPost(
        { user: { userId: '1' } },
        PostDtoStub(),
      );
      expect(createPost.title).toBe(PostDtoStub().title);
    });
  });

  describe('update', () => {
    it('should return the updated post', async () => {
      const createPost = await postsController.createPost(
        { user: { userId: '1' } },
        PostDtoStub(),
      );
      await postsController.updatePost(createPost._id, {
        title: 'new title',
      });
      const updatePost = await postsController.getPostById(createPost._id);
      expect(updatePost.title).toBe('new title');
    });
  });

  describe('get Post By User', () => {
    it('should return the corresponding saved post', async () => {
      await postsController.createPost(
        { user: { userId: '1' } },
        PostDtoStub(),
      );
      await postsController.createPost(
        { user: { userId: '1' } },
        PostDtoStub(),
      );
      await postsController.createPost(
        { user: { userId: '1' } },
        PostDtoStub(),
      );
      const posts = await postsController.getAllPostForUser({
        user: { userId: '1' },
      });
      expect(posts[0].title).toBe(PostDtoStub().title);
      expect(posts.length).toBe(3);
    });
  });

  describe('get Post By Id', () => {
    it('should return the corresponding saved post', async () => {
      const post = await postsController.createPost(
        { user: { userId: '1' } },
        PostDtoStub(),
      );
      const newPost = await postsController.getPostById(post._id);
      expect(newPost.title).toBe(PostDtoStub().title);
    });
  });

  describe('delete Post By Id', () => {
    it('should delete the corresponding saved post', async () => {
      const post = await postsController.createPost(
        { user: { userId: '1' } },
        PostDtoStub(),
      );
      const deleteAck = await postsController.deletePost(post._id);
      expect(deleteAck.acknowledged).toBe(true);
      expect(deleteAck.deletedCount).toBe(1);
    });
    it('get Post By Id should return null for deleted Post', async () => {
      const post = await postsController.createPost(
        { user: { userId: '1' } },
        PostDtoStub(),
      );
      await postsController.deletePost(post._id);
      const deletedPost = await postsController.getPostById(post._id);
      expect(deletedPost).toBeNull();
    });
  });
});
