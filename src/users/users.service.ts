// users.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving users');
    }
  }

  async findOneById(id: number): Promise<User | undefined> {
    try {
      return await this.userRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving user');
    }
  }

  async create(user: User): Promise<User> {
    try {
      const newUser = this.userRepository.create(user);
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username or email already exists');
      } else {
        throw new InternalServerErrorException('Error creating user');
      }
    }
  }

  async update(id: number, updatedUser: User): Promise<User | undefined> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { id },
      });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // Update fields
      existingUser.username = updatedUser.username;
      existingUser.email = updatedUser.email;
      // Update other fields as needed

      return await this.userRepository.save(existingUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Error updating user');
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Error deleting user');
      }
    }
  }
}
