// post.service.ts
import { ConflictException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    return this.postRepository.findOne({ where: { slug } });
  }

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    try {
      const newPost = this.postRepository.create(createPostDto);
      return await this.postRepository.save(newPost);
    } catch (error) {
      this.logger.debug(error)
      if (error.code === 'ER_DUP_ENTRY') {
        // MySQL duplicate entry error, handle accordingly
        throw new HttpException({
          success: false,
          code: error.code,
          message: 'Post with this title already exists.',
        }, HttpStatus.BAD_REQUEST);
      }
      // Rethrow the original error if it's not a duplicate entry error
      throw new HttpException({
        success: false,
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async updatePost(slug: string, updatePostDto: UpdatePostDto): Promise<Post | undefined> {
    const existingPost = await this.postRepository.findOne({ where: { slug } });
    if (!existingPost) {
      return undefined;
    }

    const updatedPost = { ...existingPost, ...updatePostDto };
    return this.postRepository.save(updatedPost);
  }

  async deletePost(slug: string): Promise<boolean> {
    const result = await this.postRepository.delete({ slug });
    return result.affected > 0;
  }
}
