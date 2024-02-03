// users.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(['superadmin', 'admin'])
  async findAll(): Promise<User[]> {
    try {
      const users = await this.userService.findAll();
      return users;
    } catch (error) {
      this.handleError(error, 'Error retrieving users');
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
      this.handleError(error, 'Error retrieving user by ID');
    }
  }

  @Post()
  async create(@Body() user: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.userService.create(user);
      return newUser;
    } catch (error) {
      this.handleError(error, 'Error creating user');
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
      this.handleError(error, 'Error updating user by ID');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.userService.remove(+id);
      // Returning HttpStatus.NO_CONTENT (204) for successful deletion
      return;
    } catch (error) {
      this.handleError(error, 'Error deleting user by ID');
    }
  }

  private handleError(error: any, message: string) {
    // Log the error or perform any additional error handling
    console.error(error);
    throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
