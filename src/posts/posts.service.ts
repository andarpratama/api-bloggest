// post.service.ts
import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, QueryFailedError, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ImageUploadDto } from './dto/image-upload.dto';
import * as crypto from 'crypto';
import * as path from 'path';
import { join } from 'path';
import { promises as fsPromises } from 'fs';


@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly connection: Connection
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

  async saveImage(fileName, postId: number): Promise<string> {
    try {
      // Get the existing post
      const postRepository = this.connection.getRepository(Post);
      const existingPost = await postRepository.findOne({where: {id: postId}});

      if (!existingPost) {
        throw new BadRequestException('Post not found');
      }

      // Update the image property with the full URL filename
      existingPost.image = fileName;

      // Save the updated post to MySQL using TypeORM
      await postRepository.save(existingPost);

      return 'Post image updated successfully';
    } catch (error) {
      console.log(error)
      throw new BadRequestException('Error updating post image');
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
