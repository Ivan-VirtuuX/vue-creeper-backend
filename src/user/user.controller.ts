import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') _id: string): Promise<User> {
    return this.userService.findById(_id);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Post(':userId/favorites/:productId')
  async addToFavorites(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.userService.addToFavorites(userId, productId);
  }

  @Delete(':userId/favorites/:productId')
  async removeFromFavorites(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.userService.removeFromFavorites(userId, productId);
  }

  @Get(':userId/favorites')
  async getFavorites(@Param('userId') userId: string) {
    return this.userService.getFavorites(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId/orders')
  async getOrders(@Param('userId') userId: string, @AuthUser() user: User) {
    if (user.userId !== userId) throw new UnauthorizedException('Unauthorized');
    return this.userService.getOrders(userId);
  }
}
