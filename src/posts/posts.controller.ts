// post.controller.ts
import { Controller, Get, Post, Put, Delete, Body, ParseIntPipe, Param, NotFoundException, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './entities/post.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';



const storage = diskStorage({
  destination: './images',
  filename: (req, file, cb) => {
    const timestamp = new Date().getTime();
    const extension = extname(file.originalname);
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    cb(null, `${timestamp}_${randomName}${extension}`);
  },
});

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

  @Post(':postId/upload-image')
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadFile(@UploadedFile() file, @Param('postId', ParseIntPipe) postId: number,) {
    try {
      const generatedFilename = file.filename;
      return this.postService.saveImage(generatedFilename, postId);
    } catch (error) {
      throw new BadRequestException('Error updating post image');
    }
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
