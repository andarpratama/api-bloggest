import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  
  constructor(private readonly authService: AuthService) {
    console.log(process.env.JWT_SECRET)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
    this.logger.log('JwtStrategy initialized');
  }

  async validate(payload: any): Promise<any> {
    const user = await this.authService.validateUserByPayload(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}