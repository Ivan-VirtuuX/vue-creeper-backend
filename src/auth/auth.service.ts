import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UserService } from '@/user/user.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/user/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string): Promise<User> {
    const users = await this.userService.findAll();

    const user = users.find((user) => user.login === login);

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      const { ...result } = user;

      return result;
    }
    return null;
  }

  generateJwtToken(userData: any) {
    const payload = {
      login: userData._doc.login,
      userId: userData._doc.userId,
    };

    return this.jwtService.sign(payload);
  }

  async login(user: User) {
    const { ...userData }: any = user;
    const { password, ...result } = userData._doc;

    return {
      id: result.userId,
      login: result.login,
      discountBalance: result.discountBalance,
      token: this.generateJwtToken(userData),
    };
  }

  async register(dto: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(dto.password, salt);

      const users = await this.userService.findAll();

      const { ...userData }: any =
        !users.some((user) => user.login === dto.login) &&
        (await this.userService.create({
          login: dto.login,
          password: hash,
        }));

      if (
        !users.find((user) => user.login === dto.login) &&
        !dto.login.match(/\d+/g)
      )
        return {
          id: userData._doc.userId,
          login: userData._doc.login,
          discountBalance: userData._doc.discountBalance,
          token: this.generateJwtToken(userData),
        };
      else if (dto.login.match(/\d+/g)) {
        throw new ForbiddenException('Недопустимые символы в имени');
      } else {
        throw new ForbiddenException('Логин занят');
      }
    } catch (err) {
      throw new ForbiddenException(err);
    }
  }
}
