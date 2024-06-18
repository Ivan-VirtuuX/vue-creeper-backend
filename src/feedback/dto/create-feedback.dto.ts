import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
