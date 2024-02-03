// post.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  async getAllPosts(): Promise<PostEntity[]> {
    return this.postService.getAllPosts();
  }

  @Get(':slug')
  async getPostBySlug(@Param('slug') slug: string): Promise<PostEntity> {
    const post = await this.postService.getPostBySlug(slug);
    if (!post) {
      throw new NotFoundException(`Post with slug '${slug}' not found`);
    }
    return post;
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postService.createPost(createPostDto);
  }

  @Put(':slug')
  async updatePost(@Param('slug') slug: string, @Body() updatePostDto: UpdatePostDto): Promise<PostEntity> {
    const updatedPost = await this.postService.updatePost(slug, updatePostDto);
    if (!updatedPost) {
      throw new NotFoundException(`Post with slug '${slug}' not found`);
    }
    return updatedPost;
  }

  @Delete(':slug')
  async deletePost(@Param('slug') slug: string): Promise<void> {
    const deleted = await this.postService.deletePost(slug);
    if (!deleted) {
      throw new NotFoundException(`Post with slug '${slug}' not found`);
    }
  }
}
