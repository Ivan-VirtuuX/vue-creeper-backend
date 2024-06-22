import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CartItem, CartItemSchema } from './cart.schema';
import { Product, ProductSchema } from '../../product/schemas/product.schema';

export type OrderDocument = Order & Document;

@Schema()
export class OrderItem extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  desc: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  type: string;

  @Prop()
  imageUrl: string;

  @Prop()
  quantity: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema()
export class Order {
  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: false })
  totalPrice: number;

  @Prop({ required: false })
  discount: number;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  deliveryMethod: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
