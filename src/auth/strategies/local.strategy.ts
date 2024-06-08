import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(login: string, pass: string) {
    const user = await this.authService.validateUser(login, pass);
    if (!user) throw new UnauthorizedException('Неверный логин или пароль');

    const { password, ...result } = user;
    return result;
  }
}
