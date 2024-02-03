import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginUserDto: { email: string; password: string },
  ): Promise<any> {
    console.log(loginUserDto.email, loginUserDto.password);
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @HttpCode(200)
  async register(
    @Body()
    payload: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
  ): Promise<any> {
    return this.authService.register(payload);
  }
}