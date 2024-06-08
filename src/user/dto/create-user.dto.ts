import { Length } from 'class-validator';

export class CreateUserDto {
  @Length(5, 20, {
    message: 'Длина логина должна быть от 5 до 20 символов',
  })
  login: string;

  @Length(8, 32, {
    message: 'Длина пароля должна быть минимум 8 символов',
  })
  password?: string;
}
