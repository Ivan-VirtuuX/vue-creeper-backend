import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginUserDto } from './dto/login-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { Order, OrderDocument } from '../cart/schemas/order.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async findOne(id: string): Promise<User> {
    const users = await this.userModel
      .find()
      .populate('favorites', '', this.userModel)
      .exec();

    const userId = users.find((user) => user.userId === id)?._id;

    return await this.userModel
      .findOne(userId)
      .populate('favorites', '', this.userModel)
      .exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);

    await this.cartModel.create({
      userId: newUser.userId,
      items: [],
    });

    return await newUser.save();
  }

  async findOneBy(cond: LoginUserDto): Promise<User> {
    return this.userModel.findOne(cond).exec();
  }

  async addToFavorites(userId: string, productId: string) {
    const user = await this.userModel.findOne({ userId });

    if (!user.favorites.find((el: string) => el === productId)) {
      await this.userModel
        .findOneAndUpdate(
          { userId },
          {
            $push: {
              favorites: productId,
            },
          },
        )
        .exec();

      return { message: 'Added to favorites' };
    }
    throw new ForbiddenException('Already in favorites');
  }

  async getFavorites(userId: string) {
    const user = await this.userModel
      .findOne({ userId })
      .populate('favorites', '', this.productModel)
      .exec();

    if (user && user.favorites.length !== 0) return user.favorites;
    return [];
  }

  async removeFromFavorites(userId: string, productId: string) {
    await this.userModel
      .findOneAndUpdate(
        { userId },
        {
          $pull: {
            favorites: productId,
          },
        },
      )
      .exec();

    return { message: 'Deleted from favorites' };
  }

  async getOrders(userId: string) {
    return this.orderModel.find({ userId });
  }
}
