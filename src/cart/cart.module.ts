import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { CartRepository } from './cart.repository';
import { Product, ProductSchema } from '../product/schemas/product.schema';
import { Order, OrderSchema } from './schemas/order.schema';
import { User, UserSchema } from '@/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository],
})
export class CartModule {}
