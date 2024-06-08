import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product, ProductSchema } from '../../product/schemas/product.schema';

export type CartDocument = Cart & Document;

@Schema()
export class CartItem extends Document {
  @Prop({ type: ProductSchema, required: true })
  product: Product;

  @Prop()
  quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema()
export class Cart {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
