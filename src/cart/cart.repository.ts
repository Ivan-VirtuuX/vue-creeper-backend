import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { User, UserDocument } from '@/user/schemas/user.schema';

@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createOrUpdateCart(
    userId: string,
    items: { productId: string; quantity: number }[],
  ) {
    let cart: any = await this.cartModel.findOne({ userId });

    if (!cart) {
      cart = new this.cartModel({ userId, items });
    } else {
      cart.items = items;
    }

    return cart.save();
  }

  async getCart(userId: string): Promise<Cart> {
    return this.cartModel.findOne({ userId });
  }

  async toggleItem(userId: string, productId: ObjectId) {
    const product = await this.productModel.findById(productId).exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const cart = await this.cartModel.findOne({ userId });

    const itemInCart = cart.items.find(
      (item) => JSON.stringify(item.product._id) === JSON.stringify(productId),
    );

    if (itemInCart) {
      await this.cartModel
        .findOneAndUpdate(
          { userId },
          {
            $pull: {
              items: {
                product,
              },
            },
          },
        )
        .exec();
      return { product, message: 'Товар удален из корзины' };
    } else {
      await this.cartModel
        .findOneAndUpdate(
          { userId },
          {
            $push: {
              items: {
                quantity: 1,
                product,
              },
            },
          },
        )
        .exec();
      return { product, message: 'Товар добавлен в корзину' };
    }
  }

  async updateItemQuantity(
    userId: string,
    productId: ObjectId,
    quantity: number,
  ) {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) throw new NotFoundException('Корзина не найдена');

    const itemIndex = cart.items.findIndex(
      (item) => JSON.stringify(item.product._id) === JSON.stringify(productId),
    );
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      throw new NotFoundException('Товар не найден в корзине');
    }
    return cart.save();
  }

  async deleteItems(userId: string, selectedIds: string[]) {
    return await this.cartModel
      .findOneAndUpdate(
        { userId },
        {
          $pull: {
            items: {
              'product._id': { $in: selectedIds },
            },
          },
        },
      )
      .exec();
  }

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const { bonus, discount } = createOrderDto;

    const createdOrder = new this.orderModel({
      userId,
      ...createOrderDto,
      discount,
      createdAt: new Date(),
    });

    if (discount) {
      const user = await this.userModel.findOneAndUpdate(
        { userId },
        {
          $inc: {
            discountBalance: -discount,
          },
        },
      );
      if (!user) throw new NotFoundException('Пользователь не найден');
    }

    const user = await this.userModel.findOneAndUpdate(
      { userId },
      {
        $inc: {
          discountBalance: bonus,
        },
      },
    );
    if (!user) throw new NotFoundException('Пользователь не найден');

    return createdOrder.save();
  }
}
