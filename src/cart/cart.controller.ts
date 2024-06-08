import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthUser } from '@/auth/decorators/auth-user.decorator';
import { User } from '@/user/schemas/user.schema';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ObjectId } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create-order')
  async createOrder(
    @AuthUser() user: User,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.cartService.createOrder(user.userId, createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCart(@AuthUser() user: User) {
    return this.cartService.getCart(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/toggle-item/:productId')
  async toggleItem(
    @AuthUser() user: User,
    @Param('productId') productId: ObjectId,
  ) {
    return this.cartService.toggleItem(user.userId, productId);
  }

  @Post(':userId')
  async createOrUpdateCart(
    @Param('userId') userId: string,
    @Body() items: { productId: string; quantity: number }[],
  ) {
    return this.cartService.createOrUpdateCart(userId, items);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update-item/:productId')
  async updateItemQuantity(
    @AuthUser() user: User,
    @Param('productId') productId: ObjectId,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateItemQuantity(
      user.userId,
      productId,
      quantity,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete-items')
  async deleteItems(
    @AuthUser() user: User,
    @Body('selectedIds') selectedIds: string[],
  ) {
    return this.cartService.deleteItems(user.userId, selectedIds);
  }
}
