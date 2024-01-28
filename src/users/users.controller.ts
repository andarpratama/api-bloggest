// users.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    try {
      const users = await this.userService.findAll();
      return users;
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | undefined> {
    try {
      const user = await this.userService.findOneById(+id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    try {
      const newUser = await this.userService.create(user);
      return newUser;
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatedUser: User): Promise<User | undefined> {
    try {
      const user = await this.userService.update(+id, updatedUser);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      const result = await this.userService.remove(+id);
      // if (!result) {
      //   throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      // }
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
