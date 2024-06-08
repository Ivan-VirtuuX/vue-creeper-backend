import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { Cart } from './schemas/cart.schema';
import { ObjectId, Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async createOrUpdateCart(
    userId: string,
    items: { productId: string; quantity: number }[],
  ): Promise<Cart> {
    return this.cartRepository.createOrUpdateCart(userId, items);
  }

  async getCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.getCart(userId);

    if (!cart) throw new NotFoundException('Корзина не найдена');
    return cart;
  }

  async toggleItem(userId: string, productId: ObjectId) {
    return this.cartRepository.toggleItem(userId, productId);
  }

  async updateItemQuantity(
    userId: string,
    productId: ObjectId,
    quantity: number,
  ): Promise<Cart> {
    return this.cartRepository.updateItemQuantity(userId, productId, quantity);
  }

  async deleteItems(userId: string, selectedIds: string[]): Promise<Cart> {
    return this.cartRepository.deleteItems(userId, selectedIds);
  }

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    return this.cartRepository.createOrder(userId, createOrderDto);
  }
}
